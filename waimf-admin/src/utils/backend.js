// Single source of truth for the API base URL used by the admin panel.
//
// NEXT_PUBLIC_* values are baked in at build time, so a typo in the Vercel
// environment variable (a stray space, a missing https://, a value pasted into
// the wrong field) silently breaks every request in the panel until someone
// notices. Anything that isn't a usable absolute URL falls back to the live
// backend instead, and a valid value still wins so the env var stays useful.

// The panel calls paths like `${BACKEND_URL}/api/footer`, so the base must NOT
// already end in /api - a trailing /api gets stripped.

// ⚠ MUST point at the WAIMF backend, never FILM6's. If this panel is aimed at
// filim-six it will happily load and save FILM6's content while looking
// completely normal - the two APIs expose the same shaped endpoints.
// NEXT_PUBLIC_BACKEND_URL in the Vercel project overrides this; the fallback
// exists so a missing variable fails obviously rather than silently reaching
// the wrong site's data.
const FALLBACK_BACKEND_URL = 'https://waimf-backend.vercel.app';

const rawBackendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').trim();

const normalise = (value) => value.replace(/\/+$/, '').replace(/\/api$/i, '');

export const BACKEND_URL = /^https?:\/\/[^\s]+$/i.test(rawBackendUrl)
  ? normalise(rawBackendUrl)
  : FALLBACK_BACKEND_URL;

export default BACKEND_URL;
