// lib/api.js

const API_BASE_URL =
  process.env.NEXT_PUBLIC_URL_API || process.env.NEXT_PUBLIC_API_URL

// 🔑 Helper to get token from localStorage
function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// ✅ Helper function
async function apiRequest(endpoint, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" }
  const authToken = token || getToken()
  if (authToken) headers.Authorization = `Bearer ${authToken}`

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) throw new Error(data.msg || "API request failed")

  return data
}

//
// 🔐 Auth APIs
//
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.msg || "Login failed")
  }

  // 🗝️ حفظ التوكن في localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token)
  }

  return { token: data.token, user: data.user }
}

export async function registerUser({ username, email, password }) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: { username, email, password },
  })

  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token)
  }

  return { token: data.token, user: data.user }
}

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

//
// 👤 User APIs
//
export async function getUserData(token) {
  return apiRequest("/users/me", { token })
}

export async function updateUser(token, data) {
  return apiRequest("/users", { method: "PUT", token, body: data })
}

export async function updatePassword(token, oldPass, newPass) {
  return apiRequest("/users/password", {
    method: "PUT",
    token,
    body: { oldPass, newPass },
  })
}

export async function updatePreferences(token, data) {
  return apiRequest("/users/preferences", { method: "PUT", token, body: data })
}

export async function updateNotifications(token, data) {
  return apiRequest("/users/notifications", {
    method: "PUT",
    token,
    body: data,
  })
}

//
// 📊 Dashboard APIs
//
export async function getDashboardStats(token) {
  return apiRequest("/dashboard/stats", { token })
}

//
// 📝 Posts APIs
//
export async function getPosts(token) {
  return apiRequest("/posts", { token })
}

export async function createPost(token, { title, content }) {
  return apiRequest("/posts", {
    method: "POST",
    token,
    body: { title, content },
  })
}

export async function getPostById(token, id) {
  return apiRequest(`/posts/${id}`, { token })
}
// 🧩 Messages APIs
export async function getMessages(chatId) {
  try {
    const messages = JSON.parse(localStorage.getItem("messages")) || {}
    return messages[chatId] || []
  } catch (err) {
    throw new Error("Failed to fetch messages")
  }
}

export async function sendMessage(chatId, content) {
  try {
    const userId = localStorage.getItem("userId")
    if (!userId) throw new Error("Not authenticated")

    const messages = JSON.parse(localStorage.getItem("messages")) || {}
    const newMsg = {
      _id: Date.now().toString(),
      chat: chatId,
      sender: { _id: userId, username: "You" },
      content,
      createdAt: new Date().toISOString(),
    }

    if (!messages[chatId]) messages[chatId] = []
    messages[chatId].push(newMsg)

    localStorage.setItem("messages", JSON.stringify(messages))

    return newMsg
  } catch (err) {
    throw new Error(err.message || "Failed to send message")
  }
}
