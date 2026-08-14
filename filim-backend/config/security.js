// Whether protected routes actually reject unauthenticated callers.
//
// Rollout is deliberately in two steps. With this false, the new login works
// and the admin panel sends its token, but nothing is rejected - every request
// that *would* be rejected is written to the activity log instead. That shows,
// from real traffic, exactly what turning the lock on will break, and it means
// there is never a moment where the panel is deployed against a backend it
// cannot talk to.
//
// Step two is flipping this to true.
//
// AUTH_ENFORCE in the backend's Vercel environment overrides it either way, so
// enforcement can be turned off from the dashboard in an emergency without
// waiting for a deploy.
const override = (process.env.AUTH_ENFORCE || '').trim().toLowerCase();

// STEP 1 (current): false - observe only.
// STEP 2: change this default to true.
const ENFORCE_BY_DEFAULT = false;

export const AUTH_ENFORCED =
  override === 'true' ? true
  : override === 'false' ? false
  : ENFORCE_BY_DEFAULT;

// Origins allowed to call the API from a browser. Server-side callers (the
// public site's own data fetching, curl, anything without an Origin header)
// are unaffected by CORS and are always allowed.
export const ALLOWED_ORIGINS = ['https://www.film6.ai', 'https://film6.ai'];

export const ALLOWED_ORIGIN_PATTERNS = [
  // Vercel gives every deployment and preview its own hostname, so the admin
  // and the site are reachable at more names than can usefully be listed.
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,
  // Any local port, because next dev picks whatever is free. This is a
  // development convenience only; nothing served from a visitor's own machine
  // gets past the sign-in check regardless.
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i,
];

export const isAllowedOrigin = (origin) =>
  !origin ||
  ALLOWED_ORIGINS.includes(origin) ||
  ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
