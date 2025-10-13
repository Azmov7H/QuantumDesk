// src/lib/api.js
import { io } from "socket.io-client";

// ============ CONFIG ============
const DEFAULT_BASE =
  typeof window !== "undefined" ? window.__API_BASE__ || "" : "";

function getGuessedBase() {
  if (typeof window === "undefined") return "";
  try {
    const { protocol, hostname } = window.location;
    const origin = process.env.NEXT_PUBLIC_API_BASE; // fallback API port
    return origin;
  } catch {
    return "";
  }
}

const config = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "",
  tokenKey: "token",
  loginRedirectTo: "/auth/login",
  retry: { retries: 3, baseDelayMs: 300 },
  socket: { path: "/socket.io" },
};

// ============ TOKEN HELPERS ============
const token = {
  get() {
    try {
      return typeof window !== "undefined"
        ? localStorage.getItem(config.tokenKey)
        : null;
    } catch {
      return null;
    }
  },
  set(v) {
    try {
      if (typeof window !== "undefined") localStorage.setItem(config.tokenKey, v);
    } catch {}
  },
  clear() {
    try {
      if (typeof window !== "undefined")
        localStorage.removeItem(config.tokenKey);
    } catch {}
  },
  exists() {
    try {
      return typeof window !== "undefined" && !!localStorage.getItem(config.tokenKey);
    } catch {
      return false;
    }
  },
  getUserId() {
    try {
      const t = this.get();
      if (!t) return null;
      const p = JSON.parse(atob(t.split(".")[1]));
      return p.id || p._id || p.userId || p.sub || null;
    } catch {
      return null;
    }
  },
};

function authHeader() {
  const t = token.get();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// ============ HELPERS ============
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function safeFetch(path, opts = {}, { retries = 2, handle401 = true } = {}) {
  const base =
    config.baseURL || DEFAULT_BASE || getGuessedBase() || "";
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const headers = { Accept: "application/json", ...authHeader(), ...opts.headers };

  if (opts.body && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(opts.body);
  }

  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, { ...opts, headers });
      const data = await res.json().catch(() => ({}));

      if (res.status === 401 && handle401) {
        token.clear();
        if (typeof window !== "undefined") window.location.href = config.loginRedirectTo;
        return { ok: false, status: 401, data: null, error: "unauthorized" };
      }

      if (!res.ok) {
        if ([502, 503, 504].includes(res.status) && attempt < retries) {
          attempt++;
          await sleep(config.retry.baseDelayMs * attempt);
          continue;
        }
        return { ok: false, status: res.status, data, error: data?.message || "fetch_error" };
      }

      return { ok: true, status: res.status, data };
    } catch (err) {
      if (attempt < retries) {
        attempt++;
        await sleep(config.retry.baseDelayMs * attempt);
        continue;
      }
      return { ok: false, status: 0, data: null, error: err.message };
    }
  }
}

// ============ ENDPOINTS ============

// ---- Auth ----
const auth = {
  register: (body) => safeFetch("/api/auth/register", { method: "POST", body }),

  login: async (email, password) => {
    const res = await safeFetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (res.ok && res.data?.token) token.set(res.data.token);
    return res;
  },

  profile: () => safeFetch("/api/auth/me", { method: "GET" }),

  logout() {
    token.clear();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
  },
};


// ---- Users ----
const users = {
  list: () => safeFetch("/api/users", { method: "GET" }),
  get: (id) => safeFetch(`/api/users/${id}`, { method: "GET" }),
    update: (body) => safeFetch("/api/users/update", { method: "PUT", body }),
  uploadImage: (formData) =>
    safeFetch("/api/users/me", {
      method: "POST",
      body: formData,
      headers: {}, // خليه فاضي لأن formData يحدد الهيدر تلقائيًا
    }),
  remove: (id) => safeFetch(`/api/users/${id}`, { method: "DELETE" }),
};

// ---- Posts ----
const posts = {
  list: () => safeFetch("/api/posts", { method: "GET" }),
  get: (id) => safeFetch(`/api/posts/${id}`, { method: "GET" }),
  create: (body) => safeFetch("/api/posts", { method: "POST", body }),
  update: (id, body) => safeFetch(`/api/posts/${id}`, { method: "PUT", body }),
  remove: (id) => safeFetch(`/api/posts/${id}`, { method: "DELETE" }),
};

// ---- Comments ----
const comments = {
  add: (postId, body) => safeFetch(`/api/posts/${postId}/comment`, { method: "POST", body }),
  list: (postId) => safeFetch(`/api/posts/${postId}/comments`, { method: "GET" }),
};

// ---- Chats ----
const chats = {
  list: () => safeFetch("/api/chats", { method: "GET" }),
  get: (id) => safeFetch(`/api/chats/${id}`, { method: "GET" }),
  create: (body) => safeFetch("/api/chats", { method: "POST", body }),
};

// ---- Messages ----
const messages = {
  list: (chatId) => safeFetch(`/api/messages/${chatId}`, { method: "GET" }),
  send: (chatId, body) => safeFetch(`/api/messages/${chatId}`, { method: "POST", body }),
};
// ---- Like ----
const like = {
  toggle: (postId) => safeFetch(`/api/posts/${postId}/like`, { method: "PUT" }),
  getLikes: (postId) => safeFetch(`/api/posts/${postId}/likes`, { method: "GET" }),
};

// ---- Notifications ----
const notifications = {
  list: () => safeFetch("/api/notifications", { method: "GET" }),
  markRead: (id) => safeFetch(`/api/notifications/${id}/read`, { method: "PUT" }),
  markAllRead: () => safeFetch(`/api/notifications/read`, { method: "PUT" }),
};

// ============ REALTIME (socket.io) ============
let socket = null;
let connected = false;
const handlers = new Map();

function _attachSocketEvents(s) {
  s.on("connect", () => {
    connected = true;
    console.log("[socket] connected:", s.id);

    // 🔹 Emit user_connected when socket opens
    const userId = token.getUserId();
    if (userId) {
      setTimeout(() => {
        s.emit("user_connected", userId);
        console.log("[socket] emitted user_connected", userId);
      }, 200);
    }
  });

  s.on("disconnect", (r) => {
    connected = false;
    console.log("[socket] disconnected:", r);
  });

  s.onAny((event, ...args) => {
    const list = handlers.get(event);
    if (list) list.forEach((fn) => fn(...args));
  });
}

async function initRealtime(providedToken = null, opts = {}) {
  const t = providedToken || token.get();
  if (!t) {
    console.warn("[socket] No token found, skipping initRealtime");
    return;
  }

  if (socket && connected) return socket;

  const base = config.baseURL || DEFAULT_BASE || getGuessedBase() || "";
  socket = io(base, {
    path: config.socket.path,
    transports: ["websocket"],
    auth: { token: t },
    ...opts,
  });

  _attachSocketEvents(socket);
  return socket;
}

function subscribe(event, fn) {
  if (!handlers.has(event)) handlers.set(event, []);
  handlers.get(event).push(fn);
  if (socket) socket.on(event, fn);
  return () => {
    const list = handlers.get(event) || [];
    handlers.set(
      event,
      list.filter((f) => f !== fn)
    );
    if (socket) socket.off(event, fn);
  };
}

function emit(event, payload) {
  if (!socket) return;
  socket.emit(event, payload);
}

function disconnectRealtime() {
  if (socket) {
    socket.disconnect();
    socket = null;
    connected = false;
  }
}

// ============ EXPORT ============
const api = {
  config,
  token,
  auth,
  users,
  posts,
  comments,
  like,
  chats,
  messages,
  notifications,
  initRealtime,
  subscribe,
  emit,
  disconnectRealtime,
};

export default api;
