// src/lib/api.js
// Single frontend helper for Next.js + shadcn app talking to Express + socket.io
// - Manages JWT token in localStorage
// - Exposes safe fetch wrapper returning { ok, status, data, error }
// - Implements REST helpers for auth, users, posts, comments, chats, messages, notifications
// - Initializes socket.io with token and exposes subscribe/emit/initRealtime helpers
// - Handles FormData uploads and retrying transient network errors
// - Handles 401 responses by clearing token and redirecting to login
//
// Usage: import api from '@/lib/api'
// or import { auth, posts, initRealtime, subscribe, emit } from '@/lib/api'

// Note: console usage is intentional for network and socket diagnostics

import { io } from 'socket.io-client';

// -----------------------------
// Config
// -----------------------------
const DEFAULT_BASE = typeof window !== 'undefined' ? (window.__API_BASE__ || '') : '';

function getGuessedBase() {
  if (typeof window === 'undefined') return '';
  try {
    const { protocol, hostname, port } = window.location;
    // Heuristic: if running on 3000, try backend on 5000
    const guessedPort = port === '3000' ? '5000' : port;
    const origin = guessedPort ? `${protocol}//${hostname}:${guessedPort}` : `${protocol}//${hostname}`;
    return origin;
  } catch (_) {
    return '';
  }
}
const TOKEN_KEY = 'token'; // localStorage key (change if you want)

const config = {
  baseURL:  process.env.NEXT_PUBLIC_API_BASE ,
  tokenKey: TOKEN_KEY,
  retry: {
    retries: 3,
    baseDelayMs: 300, // exponential backoff base
  },
  loginRedirectTo: '/auth/login',
  socket: {
    path: '/socket.io',
    // you can set extra socket options here
  },
};

// -----------------------------
// Token utilities
// -----------------------------
const tokenStore = {
  get() {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(config.tokenKey) : null;
    } catch (e) {
      console.warn('Unable to access localStorage for token:', e);
      return null;
    }
  },
  set(token) {
    try {
      if (typeof window !== 'undefined') localStorage.setItem(config.tokenKey, token);
    } catch (e) {
      console.warn('Unable to save token to localStorage:', e);
    }
  },
  clear() {
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(config.tokenKey);
    } catch (e) {
      console.warn('Unable to clear token from localStorage:', e);
    }
  },
};

// Convenience for getting Authorization header
function authHeader() {
  const t = tokenStore.get();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// -----------------------------
// Helpers: sleep
// -----------------------------
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// -----------------------------
// Safe fetch wrapper with retries
// Returns: { ok, status, data, error }
// - retries on network errors and 502/503/504
// - will NOT retry on 4xx (except optional special handling)
// - parses JSON when possible, otherwise returns text
// - auto-handles 401 by clearing token + redirect
// -----------------------------

async function safeFetch(path, opts = {}, options = {}) {
  const {
    retries = config.retry?.retries || 2,
    handle401 = false, // 👈 تحكم في الـ redirect التلقائي عند Unauthorized
  } = options;

  const base = (config.baseURL || DEFAULT_BASE || getGuessedBase() || '').toString();
  const baseTrim = base ? base.replace(/\/$/, '') : '';
  const rel = path.replace(/^\//, '');
  const url = path.startsWith('http') || !baseTrim ? path : `${baseTrim}/${rel}`;

  const defaultHeaders = {
    Accept: 'application/json',
    ...authHeader(),
  };

  const isForm =
    typeof FormData !== 'undefined' && opts.body instanceof FormData;
  const headers = opts.headers
    ? { ...defaultHeaders, ...opts.headers }
    : defaultHeaders;

  if (
    !isForm &&
    opts.body &&
    !(opts.body instanceof URLSearchParams) &&
    typeof opts.body === 'object'
  ) {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }

  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, {
        ...opts,
        headers,
        credentials: 'include',
      });

      const status = res.status;

      // ✅ التحكم في Redirect عند 401
      if (status === 401 && handle401) {
        tokenStore.clear();
        if (typeof window !== 'undefined') {
          const redirectTo = encodeURIComponent(
            window.location.pathname + window.location.search
          );
          window.location.assign(
            `${config.loginRedirectTo || '/dashboard'}?redirect=${redirectTo}`
          );
        }
        return { ok: false, status, data: null, error: 'unauthorized' };
      }

      const contentType = res.headers.get('Content-Type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      } else {
        try {
          data = await res.text();
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        if ([502, 503, 504].includes(status) && attempt < retries) {
          attempt += 1;
          const delay = config.retry.baseDelayMs * 2 ** (attempt - 1);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        return {
          ok: false,
          status,
          data,
          error: data?.message || res.statusText || 'fetch_error',
        };
      }

      return { ok: true, status, data, error: null };
    } catch (err) {
      if (attempt < retries) {
        attempt += 1;
        const delay = config.retry.baseDelayMs * 2 ** (attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      return {
        ok: false,
        status: 0,
        data: null,
        error: err?.message || String(err),
      };
    }
  }
}

// -----------------------------
// Small helpers to upload FormData safely
// -----------------------------
function buildFormData(obj = {}, form = null, namespace = '') {
  const fd = form || new FormData();

  for (const property in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, property)) continue;
    const key = namespace ? `${namespace}[${property}]` : property;
    const value = obj[property];

    if (value instanceof Date) {
      fd.append(key, value.toISOString());
    } else if (value instanceof File) {
      fd.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        // for arrays append multiple fields 'key[]' for backend compatibility
        if (v instanceof File) fd.append(`${key}[]`, v);
        else if (typeof v === 'object') buildFormData(v, fd, `${key}[${i}]`);
        else fd.append(`${key}[]`, v);
      });
    } else if (value && typeof value === 'object') {
      buildFormData(value, fd, key);
    } else if (typeof value !== 'undefined') {
      fd.append(key, value);
    }
  }

  return fd;
}

// -----------------------------
// API endpoints
// Implemented as grouped modules: auth, users, posts, comments, chats, messages, notifications
// Each function returns safeFetch's shape.
// -----------------------------

const auth = {
  login: async (email, password) => {
    const res = await safeFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (res.ok && res.data?.token) {
      tokenStore.set(res.data.token);
    }

    return res;
  },

  register: async (payload) => {
    // payload can be { name, email, password, avatarFile? }
    let opts;
    if (payload?.avatarFile) {
      const fd = buildFormData(payload);
      opts = { method: 'POST', body: fd };
    } else {
      opts = { method: 'POST', body: payload };
    }
    const res = await safeFetch('/api/auth/register', opts);
    if (res.ok && res.data?.token) tokenStore.set(res.data.token);
    return res;
  },

  logout: async () => {
    tokenStore.clear();
    // optionally call server logout
    try {
      await safeFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') window.location.assign(config.loginRedirectTo);
    return { ok: true };
  },

  // Backend exposes GET /api/auth/me for current user (README)
  getProfile: async () => safeFetch('/api/auth/me', { method: 'GET' }),
  update: async (payload) => {
    // Supports updating profile fields and password via backend's /api/auth/update
    // Will send FormData if files present, else JSON
    if (payload && Object.values(payload).some((v) => v instanceof File)) {
      // Map avatar/profile image keys to backend expected 'profileImage'
      const fd = new FormData();
      const copy = { ...payload };
      if (copy.avatarFile) { fd.append('profileImage', copy.avatarFile); delete copy.avatarFile; }
      if (copy.profileImageFile) { fd.append('profileImage', copy.profileImageFile); delete copy.profileImageFile; }
      // Append remaining fields
      buildFormData(copy, fd);
      return safeFetch('/api/auth/update', { method: 'PUT', body: fd });
    }
    return safeFetch('/api/auth/update', { method: 'PUT', body: payload });
  },
};

const users = {
  get: async (id) => safeFetch(`/api/users/${id}`, { method: 'GET' }),
  getuser: async () => safeFetch(`/api/users`, { method: 'GET' }),
  unfollow: async (id) => safeFetch(`/api/users/${id}/unfollow`, { method: 'POST' }),

  follow: async (id) => safeFetch(`/api/users/${id}/follow`, { method: 'POST' }),
  list: async (query = '') => safeFetch(`/api/users${query ? `?${query}` : ''}`, { method: 'GET' }),
  update: async (id, payload) => {
    if (payload?.avatarFile) {
      const fd = buildFormData(payload);
      return safeFetch(`/api/users/${id}`, { method: 'PUT', body: fd });
    }
    return safeFetch(`/api/users/${id}`, { method: 'PUT', body: payload });
  },
  delete: async (id) => safeFetch(`/api/users/${id}`, { method: 'DELETE' }),
  updateMe: async (payload) => {
    if (payload && Object.values(payload).some((v) => v instanceof File)) {
      // Backend expects 'avatar' for user image
      const fd = new FormData();
      const copy = { ...payload };
      if (copy.avatarFile) { fd.append('avatar', copy.avatarFile); delete copy.avatarFile; }
      if (copy.profileImageFile) { fd.append('avatar', copy.profileImageFile); delete copy.profileImageFile; }
      buildFormData(copy, fd);
      return safeFetch(`/api/users/me`, { method: 'PUT', body: fd });
    }
    return safeFetch(`/api/users/me`, { method: 'PUT', body: payload });
  },
};

const posts = {
  list: async (query = '') => safeFetch(`/api/posts${query ? `?${query}` : ''}`, { method: 'GET' }),
  get: async (id) => safeFetch(`/api/posts/${id}`, { method: 'GET' }),
  create: async (payload) => {
    // payload can include images/files
    if (payload && payload._useFormData !== false) {
      const fd = buildFormData(payload);
      const res = await safeFetch('/api/posts', { method: 'POST', body: fd });
      if (res.ok) {
        try { emit('postCreated', res.data); } catch (_) {}
      }
      return res;
    }
    const res = await safeFetch('/api/posts', { method: 'POST', body: payload });
    if (res.ok) {
      try { emit('postCreated', res.data); } catch (_) {}
    }
    return res;
  },
  update: async (id, payload) => {
    if (payload && payload._useFormData !== false) {
      const fd = buildFormData(payload);
      const res = await safeFetch(`/api/posts/${id}`, { method: 'PUT', body: fd });
      if (res.ok) {
        try { emit('postUpdated', { id, post: res.data }); } catch (_) {}
      }
      return res;
    }
    const res = await safeFetch(`/api/posts/${id}`, { method: 'PUT', body: payload });
    if (res.ok) {
      try { emit('postUpdated', { id, post: res.data }); } catch (_) {}
    }
    return res;
  },
  delete: async (id) => {
    const res = await safeFetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      try { emit('postDeleted', { id }); } catch (_) {}
    }
    return res;
  },
  likePost: async (id) => safeFetch(`/api/posts/${id}/like`, { method: 'PUT' }),
};



const comments = {
  list: async (postId) => safeFetch(`/api/posts/${postId}/comments`, { method: 'GET' }),
  add: async (postId, payload) => {
    // payload: { text, imageFile? }
    if (payload?.imageFile) {
      const fd = buildFormData(payload);
      const res = await safeFetch(`/api/posts/${postId}/comments`, { method: 'POST', body: fd });
      if (res.ok) {
        try { emit('new_comment', { postId, comment: res.data }); } catch (_) {}
      }
      return res;
    }
    const res = await safeFetch(`/api/posts/${postId}/comment`, { method: 'POST', body: payload });
    if (res.ok) {
      try { emit('new_comment', { postId, comment: res.data }); } catch (_) {}
    }
    return res;
  },
  edit: async (postId, commentId, payload) => {
    const res = await safeFetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'PUT', body: payload });
    if (res.ok) {
      try { emit('commentEdited', { postId, commentId, comment: res.data }); } catch (_) {}
    }
    return res;
  },
  delete: async (postId, commentId) => {
    const res = await safeFetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
    if (res.ok) {
      try { emit('commentDeleted', { postId, commentId }); } catch (_) {}
    }
    return res;
  },
};

const chats = {
  list: async () => safeFetch('/api/chats', { method: 'GET' }),
  create: async (payload) => safeFetch('/api/chats', { method: 'POST', body: payload }),
  get: async (id) => safeFetch(`/api/chats/${id}`, { method: 'GET' }),
  leave: async (id) => safeFetch(`/api/chats/${id}/leave`, { method: 'POST' }),
};

const messages = {
  list: async (chatId) => safeFetch(`/api/messages/${chatId}`, { method: 'GET' }),
  send: async (chatId, payload) => {
    // payload may contain text and optional files
    if (payload && Object.values(payload).some((v) => v instanceof File)) {
      // Backend expects single file under 'media'
      const fd = new FormData();
      const copy = { ...payload };
      if (copy.mediaFile) { fd.append('media', copy.mediaFile); delete copy.mediaFile; }
      if (copy.file) { fd.append('media', copy.file); delete copy.file; }
      if (copy.files && Array.isArray(copy.files)) {
        // pick first as media (backend spec suggests single image upload)
        const first = copy.files.find((f) => f instanceof File);
        if (first) fd.append('media', first);
        delete copy.files;
      }
      buildFormData(copy, fd);
      const res = await safeFetch(`/api/messages/${chatId}`, { method: 'POST', body: fd });
      if (res.ok) {
        try { emit('newMessage', { chatId, message: res.data }); } catch (_) {}
      }
      return res;
    }
    const res = await safeFetch(`/api/messages/${chatId}`, { method: 'POST', body: payload });
    if (res.ok) {
      try { emit('newMessage', { chatId, message: res.data }); } catch (_) {}
    }
    return res;
  },
};

const notifications = {
  list: async () => safeFetch('/api/notifications', { method: 'GET' }),
  markRead: async (id) => safeFetch(`/api/notifications/${id}/read`, { method: 'POST' }),
  markAllRead: async () => safeFetch('/api/notifications/read', { method: 'PUT' }),
};

// -----------------------------
// Realtime (socket.io) helpers
// - initRealtime(token?) -> connects socket using token (or from localStorage)
// - subscribe(event, handler) -> returns unsubscribe function
// - emit(event, payload)
// - onConnect/onDisconnect hooks
// -----------------------------
let socket = null;
let socketConnected = false;
const socketHandlers = new Map();

function _applySocketListeners(s) {
  if (!s) return;
  s.off();

  s.on('connect', () => {
    socketConnected = true;
    console.info('[api] socket connected', s.id);
  });

  s.on('disconnect', (reason) => {
    socketConnected = false;
    console.info('[api] socket disconnected', reason);
  });

  // route all events to our handlers map
  s.onAny((event, ...args) => {
    const handlers = socketHandlers.get(event);
    if (handlers && handlers.length) {
      handlers.forEach((h) => {
        try {
          h(...args);
        } catch (e) {
          console.error('socket handler error for', event, e);
        }
      });
    }
  });
}

async function initRealtime(providedToken = null, opts = {}) {
  // if already connected and token same, return existing socket
  const token = providedToken || tokenStore.get();
  if (!token) {
    console.warn('[api] initRealtime called without token');
    return null;
  }

  // if already connected with same token, return
  if (socket && socket.connected && socket.io?.opts?.auth?.token === token) return socket;

  // build connection options: prefer auth (socket.io v3+), fallback to query
  const socketOpts = {
    path: config.socket.path,
    autoConnect: true,
    transports: ['websocket'],
    auth: { token },
    ...config.socket,
    ...opts,
  };

  // create client
  socket = io(config.baseURL, socketOpts);

  _applySocketListeners(socket);

  return socket;
}

function subscribe(event, handler) {
  if (!socket) {
    console.warn('[api] subscribe called before socket initialized. Call initRealtime(token) first.');
  }
  if (!socketHandlers.has(event)) socketHandlers.set(event, []);
  socketHandlers.get(event).push(handler);

  // return unsubscribe fn
  return () => {
    const arr = socketHandlers.get(event) || [];
    const idx = arr.indexOf(handler);
    if (idx >= 0) arr.splice(idx, 1);
    if (arr.length === 0) socketHandlers.delete(event);
  };
}

function emit(event, payload, ack) {
  if (!socket) throw new Error('Socket not initialized. Call initRealtime first.');
  if (!socket.connected) {
    console.warn('[api] socket not connected — emit will still try to send');
  }
  if (ack && typeof ack === 'function') return socket.emit(event, payload, ack);
  return socket.emit(event, payload);
}

function disconnectRealtime() {
  if (!socket) return;
  try {
    socket.disconnect();
  } catch (e) {
    // ignore
  }
  socket = null;
  socketConnected = false;
}

// -----------------------------
// Production-ready utilities
// -----------------------------
function setBaseURL(url) {
  config.baseURL = url.replace(/\/$/, '');
}

function setLoginRedirect(path) {
  config.loginRedirectTo = path;
}

// Internal: helper to emit important events alongside REST calls
async function addCommentAndEmit(postId, payload) {
  // Add comment via REST and on success emit via socket
  const res = await comments.add(postId, payload);
  if (res.ok && socket) {
    try {
      // emit a domain-specific event
      emit('new_comment', { postId, comment: res.data });
    } catch (e) {
      // ignore
    }
  }
  return res;
}

// -----------------------------
// Final API export
// -----------------------------
const api = {
  // config
  config,
  setBaseURL,
  setLoginRedirect,

  // token utils
  token: tokenStore,

  // endpoints
  auth,
  users,
  posts,
  comments,
  chats,
  messages,
  notifications,

  // realtime
  initRealtime,
  subscribe,
  emit,
  disconnectRealtime,

  // helper
  safeFetch,
  addCommentAndEmit,
};

export default api;

// -----------------------------
// Examples & patterns (CLIENT-SIDE)
// Paste these snippets into your React components or pages. They are included here as comments
// to keep usage examples coupled with the implementation.
// -----------------------------

/*
Example 1: login -> set token -> init realtime -> subscribe to events

import api from '@/lib/api'

async function handleLogin() {
  const { ok, data, error } = await api.auth.login('ali@example.com', 'secret');
  if (!ok) return console.error('login failed', error);

  // token saved automatically by the library
  // initialize socket realtime
  await api.initRealtime(); // will read token from localStorage

  // subscribe to new comments and messages
  const unsub1 = api.subscribe('receive_comment', (commentPayload) => {
    console.log('comment arrived', commentPayload);
  });

  const unsub2 = api.subscribe('newMessage', (message) => {
    console.log('new message', message);
  });

  // to unsubscribe later:
  // unsub1(); unsub2();
}

Example 2: addComment with optimistic update (React example)

// inside a React component
const [comments, setComments] = useState([]);

async function onAddComment(text, imageFile) {
  // make optimistic comment object
  const tempId = `temp-${Date.now()}`;
  const optimistic = { id: tempId, text, author: { id: 'me', name: 'Me' }, pending: true };
  setComments((c) => [optimistic, ...c]);

  // prepare payload (library will convert to FormData if imageFile present)
  const payload = { text };
  if (imageFile) payload.imageFile = imageFile;

  const res = await api.comments.add(postId, payload);

  if (res.ok) {
    // replace optimistic with real response
    setComments((c) => c.map((it) => (it.id === tempId ? res.data : it)));
    // emit socket event so other clients get it (library will emit automatically if you use addCommentAndEmit)
    // api.emit('new_comment', { postId, comment: res.data });
  } else {
    // mark as failed
    setComments((c) => c.map((it) => (it.id === tempId ? { ...it, pending: false, error: res.error } : it)));
    console.error('comment failed', res.error);
  }
}

Example 3: handling 401s

// safeFetch auto-clears token and redirects on 401. If you want to intercept and show a toast, do:
const res = await api.auth.getProfile();
if (!res.ok && res.status === 401) {
  // you can show a message, but the library will already clear token + redirect
}

CORS preflight notes:
- If you see network errors (TypeError: Failed to fetch) when making non-GET requests or using custom headers,
  your Express server must properly handle OPTIONS preflight and set these headers:
    Access-Control-Allow-Origin: https://your-frontend.example
    Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
    Access-Control-Allow-Headers: Content-Type,Authorization
    Access-Control-Allow-Credentials: true
- In Express you can use the cors middleware:
    import cors from 'cors'
    app.use(cors({ origin: ['https://your-frontend.example'], credentials: true }));


Notes:
- Adjust config.baseURL early (e.g., in _app.jsx or a boot script) with api.setBaseURL(process.env.NEXT_PUBLIC_API_BASE)
- The library prefers socket.io auth: { token } but falls back gracefully if your backend expects query params (server should accept both).
- All endpoints return { ok, status, data, error } for consistent handling.
*/