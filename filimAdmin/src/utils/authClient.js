// Sign-in state for the admin panel, and the plumbing that puts the signed-in
// person's token on every request to the backend.
//
// The panel makes API calls from roughly fifty files, so instead of editing all
// of them this hooks axios and fetch once. Anything aimed at the backend gets
// the token added; anything else (notably the direct uploads to Cloudinary) is
// left completely alone, so the token is never sent to a third party.

import axios from 'axios';
import { BACKEND_URL } from './backend';

const TOKEN_KEY = 'film6AdminToken';
const USER_KEY = 'film6AdminUser';

const browser = () => typeof window !== 'undefined';

export const getToken = () => (browser() ? localStorage.getItem(TOKEN_KEY) : null);

export const getUser = () => {
  if (!browser()) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const setSession = ({ token, user }) => {
  if (!browser()) return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  // The old shared-password flag. Removed so a stale one can never stand in
  // for a real sign-in.
  localStorage.removeItem('adminAuthenticated');
};

export const clearSession = () => {
  if (!browser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('adminAuthenticated');
};

const isBackendUrl = (url) => {
  try {
    const absolute = new URL(String(url), window.location.href);
    return absolute.origin === new URL(BACKEND_URL).origin;
  } catch {
    return false;
  }
};

// Sending someone back to the login screen has to survive being triggered from
// anywhere, including inside an interceptor, so it uses a plain navigation
// rather than the router. Guarded so a page full of failing requests produces
// one redirect, not fifty.
let redirecting = false;
const signOutAndRedirect = () => {
  if (!browser() || redirecting) return;
  if (window.location.pathname === '/login') return;
  redirecting = true;
  clearSession();
  window.location.href = '/login?expired=1';
};

let installed = false;

export const installAuth = () => {
  if (installed || !browser()) return;
  installed = true;

  axios.interceptors.request.use((config) => {
    const token = getToken();
    const url = config.baseURL
      ? `${config.baseURL}${config.url || ''}`
      : config.url;
    if (token && isBackendUrl(url)) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401 && isBackendUrl(error.config?.url)) {
        signOutAndRedirect();
      }
      return Promise.reject(error);
    },
  );

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    const token = getToken();

    if (token && isBackendUrl(url)) {
      const headers = new Headers(
        init.headers || (typeof input === 'object' ? input.headers : undefined),
      );
      headers.set('Authorization', `Bearer ${token}`);
      init = { ...init, headers };
    }

    const response = await originalFetch(input, init);
    if (response.status === 401 && isBackendUrl(url)) signOutAndRedirect();
    return response;
  };
};

export const login = async (email, password) => {
  const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, {
    email,
    password,
  });
  setSession({ token: data.token, user: data.user });
  return data.user;
};

/** Confirms with the backend that the stored token is still valid. */
export const fetchMe = async () => {
  const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`);
  setSession({ user: data.user });
  return data.user;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await axios.post(`${BACKEND_URL}/api/auth/change-password`, {
    currentPassword,
    newPassword,
  });
  setSession({ token: data.token, user: data.user });
  return data.user;
};

export const logout = () => {
  clearSession();
  if (browser()) window.location.href = '/login';
};
