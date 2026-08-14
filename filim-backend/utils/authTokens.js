// Password hashing and session tokens.
//
// Deliberately built on node's own crypto module rather than pulling in bcrypt
// and jsonwebtoken: this runs as a Vercel serverless function, and every extra
// dependency is another thing that can fail to install on a deploy of a live
// site. scrypt is a stronger password hash than bcrypt anyway, and a signed
// token is a small, readable amount of code.

import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Signing secret
// ---------------------------------------------------------------------------

// Set JWT_SECRET in the backend's Vercel environment to control this directly.
// Without it we derive a secret from MONGODB_URI, which is already a secret the
// backend has and which is not in the (public) repository. Deriving through
// SHA-256 means the token secret never reveals the database URI.
//
// Consequence worth knowing: rotating the database password also invalidates
// every session, so everyone simply logs in again. That is a safe failure.
const secretKey = () => {
  const explicit = (process.env.JWT_SECRET || '').trim();
  if (explicit.length >= 16) return Buffer.from(explicit, 'utf8');

  const seed = process.env.MONGODB_URI;
  if (!seed) {
    // Nothing secret to work from - refuse rather than sign with something
    // guessable, which would let anyone mint their own admin token.
    throw new Error('Cannot derive a token secret: set JWT_SECRET');
  }
  return crypto.createHash('sha256').update(`film6-auth-v1|${seed}`).digest();
};

// ---------------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------------

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

/** Stored form: scrypt$N$r$p$<salt base64>$<hash base64> */
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(
    String(password),
    salt,
    SCRYPT.keylen,
    // maxmem must be raised: node's default (32MB) is below what N=16384 needs
    // once r=8, and it throws rather than degrading.
    { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, maxmem: 64 * 1024 * 1024 },
  );
  return [
    'scrypt',
    SCRYPT.N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString('base64'),
    hash.toString('base64'),
  ].join('$');
};

export const verifyPassword = (password, stored) => {
  try {
    const [scheme, N, r, p, saltB64, hashB64] = String(stored || '').split('$');
    if (scheme !== 'scrypt') return false;

    const expected = Buffer.from(hashB64, 'base64');
    const actual = crypto.scryptSync(
      String(password),
      Buffer.from(saltB64, 'base64'),
      expected.length,
      {
        N: Number(N),
        r: Number(r),
        p: Number(p),
        maxmem: 64 * 1024 * 1024,
      },
    );
    // Constant time, so the comparison itself cannot be used to guess the hash.
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
};

/** A password for a brand new account, to be changed on first login. */
export const randomPassword = (bytes = 9) =>
  crypto.randomBytes(bytes).toString('base64url');

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const b64url = (buf) => Buffer.from(buf).toString('base64url');

const sign = (data) =>
  crypto.createHmac('sha256', secretKey()).update(data).digest();

export const TOKEN_TTL_SECONDS = 12 * 60 * 60;

/**
 * `<payload>.<signature>`, both base64url.
 *
 * There is no algorithm header to parse, which removes the classic JWT
 * "alg: none" and algorithm-confusion mistakes entirely - verification always
 * recomputes the same HMAC and compares.
 */
export const createToken = (user) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    // Bumped whenever the account's password changes or it is disabled, so
    // existing tokens stop working immediately instead of at expiry.
    ver: user.tokenVersion || 0,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const body = b64url(JSON.stringify(payload));
  return `${body}.${b64url(sign(body))}`;
};

/** Returns the payload, or null for anything not currently valid. */
export const readToken = (token) => {
  try {
    const [body, signature] = String(token || '').split('.');
    if (!body || !signature) return null;

    const given = Buffer.from(signature, 'base64url');
    const expected = sign(body);
    if (given.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(given, expected)) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
};
