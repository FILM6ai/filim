// Single source of truth for the API base URL used by the website.
//
// NEXT_PUBLIC_* values are baked in at build time, so a typo in the Vercel
// environment variable (a stray space, a missing https://, a value pasted into
// the wrong field) silently breaks every request on the site until someone
// notices. Anything that isn't a usable absolute URL falls back to the live
// backend instead, and a valid value still wins so the env var stays useful.
//
// The website calls paths like `${API_BASE_URL}/home/gethome`, so the base has
// to include /api - it gets added if it is missing.

const FALLBACK_API_BASE_URL = 'https://filim-six.vercel.app/api';

const rawBackendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '').trim();

const normalise = (value) => {
  const trimmed = value.replace(/\/+$/, '');
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = /^https?:\/\/[^\s]+$/i.test(rawBackendUrl)
  ? normalise(rawBackendUrl)
  : FALLBACK_API_BASE_URL;

export default API_BASE_URL;
