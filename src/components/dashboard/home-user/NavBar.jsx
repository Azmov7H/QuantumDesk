"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Redirecting to login...");
      window.location.href = "/auth/login";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(setProfile)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div className="text-gray-400">Loading...</div>;

  return (
    <header className="flex items-center justify-between border-b border-[#223649] px-10 py-3">
      {/* Left side */}
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">QuantumLeap</h2>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-9">
          <Link className="text-white text-sm font-medium" href="#">Home</Link>
          <Link className="text-white text-sm font-medium" href="#">Explore</Link>
          <Link className="text-white text-sm font-medium" href="#">My Library</Link>
          <Link className="text-white text-sm font-medium" href="#">Create</Link>
        </nav>
      </div>

      {/* Right side */}
      <div className="flex flex-1 justify-end gap-8 items-center">
        {/* Search */}
        <label className="flex flex-col min-w-40 max-w-64">
          <div className="flex items-stretch rounded-xl h-10 bg-[#223649]">
            <div className="text-[#90adcb] flex items-center pl-4">🔍</div>
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-[#223649] text-white px-4 rounded-r-xl focus:ring-2 focus:ring-[#3b82f6] focus:outline-none"
            />
          </div>
        </label>

        {/* Notification */}
        <button className="rounded-xl h-10 bg-[#223649] text-white px-3">
          🔔
        </button>

        {/* User Avatar */}
        <Link href="/dashboard/profile">
          <Avatar>
            <AvatarImage src={profile?.profileImage || "/default-avatar.png"} />
            <AvatarFallback>
              {profile?.username ? profile.username.slice(0, 2).toUpperCase() : "NA"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
