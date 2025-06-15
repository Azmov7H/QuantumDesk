export async function loginUser({ email, password }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Login failed"); // msg بدل message حسب ما يرجعه الباك
  }

  const data = await res.json();

  // فقط token
  return { token: data.token };
}

export async function registerUser({ username, email, password }: { username: string; email: string; password: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_API;

  if (!baseUrl) throw new Error("API URL is not defined.");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    return await res.json();
  } catch (err: any) {
    console.error("Register error:", err);
    throw new Error(err.message || "Something went wrong during registration");
  }
}
