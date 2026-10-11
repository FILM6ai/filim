// Whether protected routes actually reject unauthenticated callers.
//
// Rolled out in two steps. The first shipped with this false: the login worked
// and the admin panel sent its token, but nothing was rejected, so there was
// never a moment where the panel was deployed against a backend it could not
// talk to. This is step two.
//
// Everything that calls the API was accounted for before flipping it: the
// public site makes only public reads plus its three visitor-facing form
// posts; the admin panel was driven through all seventeen of its screens
// against an enforcing backend, producing forty-five calls and no rejections.
// The two stale deployments that also reached the database are no longer a
// factor - one now points at an abandoned cluster, the other at its own.
//
// AUTH_ENFORCE in the backend's Vercel environment overrides this either way,
// so enforcement can be switched off from the dashboard in an emergency
// without waiting for a deploy.
const override = (process.env.AUTH_ENFORCE || '').trim().toLowerCase();

const ENFORCE_BY_DEFAULT = true;

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
