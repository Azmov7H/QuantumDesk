export async function loginUser({ email, password }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.msg || "Login failed");
  }
  localStorage.setItem("token", data.token);

  return { token: data.token, user: data.user };
}

export async function registerUser({ username, email, password }) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_API;
  if (!baseUrl) throw new Error("API URL is not defined.");

  const res = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.msg || "Registration failed");
  }

  return { token: data.token, user: data.user };
}
export async function getUser() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`)
  return res.json()
}

export async function updateUser(data: any) {
  await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function updatePassword(oldPass: any, newPass: any) {
  await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPass, newPass }),
  })
}

export async function updatePreferences(data: any) {
  await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}

export async function updateNotifications(data) {
  await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
}
