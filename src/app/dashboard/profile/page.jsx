// app/(dashboard)/dashboard/profile/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/users`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <div className="p-4 border rounded bg-card">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}
