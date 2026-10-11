import AdminUser from '../modles/adminUser.js';
import ActivityLog from '../modles/activityLog.js';
import {
  hashPassword,
  verifyPassword,
  createToken,
  randomPassword,
  TOKEN_TTL_SECONDS,
} from '../utils/authTokens.js';
import { clientIp } from '../middlewere/auth.js';

const MIN_PASSWORD_LENGTH = 10;
const MAX_FAILED_ATTEMPTS = 8;
const LOCKOUT_MINUTES = 15;

// What the admin panel is allowed to know about an account.
const publicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  disabled: Boolean(user.disabled),
  mustChangePassword: Boolean(user.mustChangePassword),
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
});

const passwordProblem = (password) => {
  const value = String(password || '');
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
};

// ---------------------------------------------------------------------------
// Signing in
// ---------------------------------------------------------------------------

export const login = async (req, res) => {
  try {
    const email = String(req.body?.email || '').toLowerCase().trim();
    const password = String(req.body?.password || '');

    // Deliberately identical for "no such account" and "wrong password", so
    // the login form cannot be used to find out which addresses are real.
    const reject = () =>
      res
        .status(401)
        .json({ success: false, message: 'Incorrect email or password.' });

    const user = await AdminUser.findOne({ email }).select('+passwordHash');
    if (!user || user.disabled) return reject();

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutes = Math.ceil((user.lockedUntil - new Date()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Try again in ${minutes} minute${
          minutes === 1 ? '' : 's'
        }.`,
      });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60000);
        user.failedLoginAttempts = 0;
      }
      await user.save();

      await ActivityLog.create({
        userEmail: email || '(blank)',
        method: 'POST',
        path: '/api/auth/login',
        action: 'Failed sign-in',
        status: 401,
        ip: clientIp(req),
        userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
        origin: String(req.headers.origin || ''),
        unauthenticated: true,
      }).catch(() => {});

      return reject();
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    await user.save();

    await ActivityLog.create({
      user: user._id,
      userEmail: user.email,
      method: 'POST',
      path: '/api/auth/login',
      action: 'Signed in',
      status: 200,
      ip: clientIp(req),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      origin: String(req.headers.origin || ''),
    }).catch(() => {});

    return res.status(200).json({
      success: true,
      token: createToken(user),
      expiresIn: TOKEN_TTL_SECONDS,
      user: publicUser(user),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/** Lets the panel confirm on load that the stored token is still good. */
export const me = async (req, res) =>
  res.status(200).json({ success: true, user: publicUser(req.authUser) });

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    const problem = passwordProblem(newPassword);
    if (problem) return res.status(400).json({ success: false, message: problem });

    const user = await AdminUser.findById(req.authUser._id).select(
      '+passwordHash',
    );
    if (!verifyPassword(currentPassword, user.passwordHash)) {
      return res
        .status(401)
        .json({ success: false, message: 'Current password is incorrect.' });
    }
    if (verifyPassword(newPassword, user.passwordHash)) {
      return res.status(400).json({
        success: false,
        message: 'The new password must be different from the current one.',
      });
    }

    user.passwordHash = hashPassword(newPassword);
    user.mustChangePassword = false;
    // Invalidates every token issued before this point, including any copy
    // someone else might have taken.
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    await ActivityLog.create({
      user: user._id,
      userEmail: user.email,
      method: 'POST',
      path: '/api/auth/change-password',
      action: 'Changed their password',
      status: 200,
      ip: clientIp(req),
    }).catch(() => {});

    // The caller's current token was just invalidated, so hand back a fresh one
    // rather than signing them out mid-edit.
    return res.status(200).json({
      success: true,
      token: createToken(user),
      expiresIn: TOKEN_TTL_SECONDS,
      user: publicUser(user),
      message: 'Password updated.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------------
// Managing accounts (owners only)
// ---------------------------------------------------------------------------

export const listUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({}).sort({ createdAt: 1 });
    return res
      .status(200)
      .json({ success: true, users: users.map(publicUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').toLowerCase().trim();
    const role = req.body?.role === 'owner' ? 'owner' : 'editor';

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: 'Name and email are required.' });
    }
    if (await AdminUser.findOne({ email })) {
      return res
        .status(409)
        .json({ success: false, message: 'That email already has an account.' });
    }

    const temporary = randomPassword();
    const user = await AdminUser.create({
      name,
      email,
      role,
      passwordHash: hashPassword(temporary),
      mustChangePassword: true,
    });

    // Shown once, in the panel, for whoever is creating the account to pass on.
    // It is never stored in readable form and cannot be retrieved again.
    return res
      .status(201)
      .json({ success: true, user: publicUser(user), temporaryPassword: temporary });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No such account.' });
    }

    const isSelf = String(user._id) === String(req.authUser._id);
    const { name, email, role, disabled } = req.body || {};

    if (typeof name === 'string' && name.trim()) user.name = name.trim();

    if (typeof email === 'string' && email.trim()) {
      const next = email.toLowerCase().trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(next)) {
        return res
          .status(400)
          .json({ success: false, message: 'That does not look like an email address.' });
      }
      if (next !== user.email) {
        const taken = await AdminUser.findOne({ email: next, _id: { $ne: user._id } });
        if (taken) {
          return res
            .status(409)
            .json({ success: false, message: 'That email already has an account.' });
        }
        // Sessions are keyed on the account, not the address, so changing it
        // does not sign anyone out mid-edit.
        user.email = next;
      }
    }

    if (role === 'owner' || role === 'editor') {
      if (isSelf && role !== 'owner') {
        return res.status(400).json({
          success: false,
          message: 'You cannot remove your own owner access.',
        });
      }
      user.role = role;
    }

    if (typeof disabled === 'boolean') {
      if (isSelf && disabled) {
        return res
          .status(400)
          .json({ success: false, message: 'You cannot disable your own account.' });
      }
      if (disabled && !user.disabled) {
        // Signs them out of any session they already have open.
        user.tokenVersion = (user.tokenVersion || 0) + 1;
      }
      user.disabled = disabled;
    }

    // Never leave the site with no one who can manage accounts.
    if (user.role !== 'owner' || user.disabled) {
      const owners = await AdminUser.countDocuments({
        role: 'owner',
        disabled: false,
        _id: { $ne: user._id },
      });
      if (owners === 0) {
        return res.status(400).json({
          success: false,
          message: 'There has to be at least one active owner.',
        });
      }
    }

    await user.save();
    return res.status(200).json({ success: true, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No such account.' });
    }

    const temporary = randomPassword();
    user.passwordHash = hashPassword(temporary);
    user.mustChangePassword = true;
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    return res
      .status(200)
      .json({ success: true, user: publicUser(user), temporaryPassword: temporary });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.authUser._id)) {
      return res
        .status(400)
        .json({ success: false, message: 'You cannot delete your own account.' });
    }
    const user = await AdminUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No such account.' });
    }

    const owners = await AdminUser.countDocuments({
      role: 'owner',
      disabled: false,
      _id: { $ne: user._id },
    });
    if (owners === 0) {
      return res.status(400).json({
        success: false,
        message: 'There has to be at least one active owner.',
      });
    }

    await user.deleteOne();
    return res.status(200).json({ success: true, message: 'Account removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------------------------------------------------------------------
// Activity log
// ---------------------------------------------------------------------------

export const listActivity = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const filter = {};
    if (req.query.onlyUnauthenticated === 'true') filter.unauthenticated = true;
    if (req.query.email) filter.userEmail = String(req.query.email).toLowerCase();

    const [entries, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ActivityLog.countDocuments(filter),
    ]);

    return res.status(200).json({ success: true, total, page, limit, entries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
