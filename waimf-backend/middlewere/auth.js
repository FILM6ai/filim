// Route protection and the activity log.
//
// `protect` is put in front of everything that changes site content, everything
// that reads personal data, and the Cloudinary signing endpoint. Public reads
// (the pages the live site fetches to render itself) are deliberately left
// open - they are the same content any visitor can already see.

import AdminUser from '../modles/adminUser.js';
import ActivityLog from '../modles/activityLog.js';
import { readToken } from '../utils/authTokens.js';
import { AUTH_ENFORCED } from '../config/security.js';

const bearer = (req) => {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7).trim() : '';
};

const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.socket?.remoteAddress ||
  '';

/**
 * Resolves the caller from their token, if they sent a valid one.
 *
 * The token is checked against the stored account on every request rather than
 * trusted on its own, so disabling someone or changing a password takes effect
 * immediately instead of whenever their token happens to expire.
 */
export const resolveUser = async (req) => {
  if (req.authUserResolved) return req.authUser;
  req.authUserResolved = true;
  req.authUser = null;

  const payload = readToken(bearer(req));
  if (!payload) return null;

  try {
    const user = await AdminUser.findById(payload.sub);
    if (!user || user.disabled) return null;
    if ((user.tokenVersion || 0) !== (payload.ver || 0)) return null;
    req.authUser = user;
    return user;
  } catch {
    return null;
  }
};

// A human-readable summary of what a request was trying to do, so the log is
// readable without knowing the API by heart.
const describe = (req) => {
  const path = req.baseUrl + (req.route?.path || req.path || '');
  const verb =
    req.method === 'DELETE' ? 'Deleted'
    : req.method === 'POST' ? 'Created'
    : req.method === 'PUT' || req.method === 'PATCH' ? 'Updated'
    : 'Read';

  const subject =
    /festival/i.test(path) ? 'the festival page'
    : /studio/i.test(path) ? 'the studio page'
    : /service/i.test(path) ? 'the production page'
    : /blog/i.test(path) ? 'a news article'
    : /news/i.test(path) ? 'the news page'
    : /home/i.test(path) ? 'the home page'
    : /contact/i.test(path) ? 'the contact page'
    : /faq/i.test(path) ? 'the FAQ page'
    : /term/i.test(path) ? 'the terms page'
    : /metadata/i.test(path) ? 'page metadata'
    : /footer/i.test(path) ? 'the footer'
    : /navbar/i.test(path) ? 'the menu'
    : /form/i.test(path) ? 'contact form submissions'
    : /registration/i.test(path) ? 'registrations'
    : /email/i.test(path) ? 'newsletter subscribers'
    : /cloudinary/i.test(path) ? 'a media upload'
    : /auth/i.test(path) ? 'an account'
    : path;

  return `${verb} ${subject}`;
};

const record = async (req, { user, unauthenticated }) => {
  try {
    return await ActivityLog.create({
      user: user?._id || null,
      userEmail: user?.email || null,
      method: req.method,
      path: req.originalUrl.split('?')[0],
      action: describe(req),
      ip: clientIp(req),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 300),
      origin: String(req.headers.origin || ''),
      unauthenticated,
    });
  } catch (error) {
    // Logging must never be the reason an edit fails.
    console.error('activity log write failed:', error?.message);
    return null;
  }
};

/**
 * @param {{ roles?: string[] }} [options] restrict to particular roles.
 */
export const protect = (options = {}) => async (req, res, next) => {
  const user = await resolveUser(req);
  const allowedRoles = options.roles;
  const roleOk = !allowedRoles || (user && allowedRoles.includes(user.role));
  const permitted = Boolean(user) && roleOk;

  // Written before the handler runs, so the record survives even if the
  // serverless function is frozen the moment it responds.
  const entry = await record(req, { user, unauthenticated: !permitted });

  if (entry) {
    // The status code is only known once the response is on its way out, so
    // filling it in is best-effort on top of an already-durable record.
    res.on('finish', () => {
      ActivityLog.updateOne({ _id: entry._id }, { status: res.statusCode }).catch(
        () => {},
      );
    });
  }

  if (permitted || !AUTH_ENFORCED) return next();

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Please sign in to the admin panel to do that.',
    });
  }
  return res.status(403).json({
    success: false,
    message: 'Your account does not have permission to do that.',
  });
};

/** Same, but always enforced - used by the account-management endpoints. */
export const requireAuth = (options = {}) => async (req, res, next) => {
  const user = await resolveUser(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Not signed in.' });
  }
  if (options.roles && !options.roles.includes(user.role)) {
    return res
      .status(403)
      .json({ success: false, message: 'Owner access required.' });
  }
  return next();
};

export { clientIp };
