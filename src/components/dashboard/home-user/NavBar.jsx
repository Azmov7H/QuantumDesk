"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, PlusCircle, MessageSquare } from "lucide-react";
import NotificationBell from "@/components/notifications/page";

export default function Navbar() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
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
    <header className="flex items-center justify-between border-b border-[#223649] px-4 md:px-6 py-3 text-white relative">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">
            QL
          </div>
          <span className="hidden sm:inline-block text-lg">QuantumLeap</span>
        </Link>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard/new-post" className="p-2 rounded-full hover:bg-[#223649] transition">
            <PlusCircle size={24} />
          </Link>
          <Link href="/dashboard/chat" className="p-2 rounded-full hover:bg-[#223649] transition">
            <MessageSquare size={24} />
          </Link>
        </div>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 hidden md:flex justify-center px-4">
        <div className="flex items-center w-full max-w-md bg-[#223649] rounded-xl h-10">
          <span className="px-3 text-[#90adcb]">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-[#223649] text-white px-3 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          />
        </div>
      </div>

      {/* Right: Notifications + Avatar + Mobile Menu */}
      <div className="flex items-center gap-3">
        <NotificationBell />

        <Link href="/dashboard/profile">
          <Avatar>
            <AvatarImage src={profile.profileImage || "/default-avatar.png"} />
            <AvatarFallback>
              {profile.username ? profile.username.slice(0, 2).toUpperCase() : "NA"}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white">
          <Menu />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="absolute top-14 left-0 w-full bg-[#101a23] border-t border-[#223649] flex flex-col items-start px-6 py-4 gap-4 md:hidden z-50">
          <Link href="/dashboard/new-post" className="flex items-center gap-2 p-2 hover:bg-[#223649] rounded">
            <PlusCircle size={20} /> New Post
          </Link>
          <Link href="/dashboard/chat" className="flex items-center gap-2 p-2 hover:bg-[#223649] rounded">
            <MessageSquare size={20} /> Messages
          </Link>

        </nav>
      )}
    </header>
  );
}
