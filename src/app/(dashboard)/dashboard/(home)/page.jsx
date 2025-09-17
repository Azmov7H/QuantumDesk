"use client";

import { useEffect, useState } from "react";

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in Dashboard:", token);
    if (!token) {
      setError("No token found. Please login.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/profile`, {
      method:"GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div className="text-white">Loading...</div>;

  return (
    <header className="mb-8 text-white">
      <h1 className="text-3xl font-bold">
        Welcome back, {profile.username || "Guest"}
      </h1>
      <p className="text-[#c0c5d0]">
        Here’s what’s happening with your projects today.
      </p>
    </header>
  );
}
