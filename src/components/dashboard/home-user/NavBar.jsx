"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { IoChatboxOutline } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import NotificationBell from "./Notification";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="flex items-center justify-between border-b border-[#223649] px-6 py-3 text-white">
      {/* Left side */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <svg viewBox="0 0 48 48" fill="none" className="w-5 h-5">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
          </svg>
          <span>QuantumLeap</span>
        </Link>

        {/* Links - hidden on mobile */}
        <nav className="hidden md:flex items-center  gap-6 text-sm font-medium">
          <Link href="#" className="hover:text-blue-400">Home</Link>
          <Link href="#" className="hover:text-blue-400 flex gap-2 items-center">Create <IoIosAdd className="font-bold" /></Link>
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search - hidden on mobile */}
        <label className="hidden md:flex min-w-40 max-w-64">
          <div className="flex items-stretch rounded-xl h-10 bg-[#223649] w-full">
            <div className="text-[#90adcb] flex items-center pl-3"><CiSearch /></div>
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-[#223649] text-white px-3 rounded-r-xl focus:ring-1 focus:ring-[#3b82f6] focus:outline-none"
            />
          </div>
        </label>

        {/* Notification */}
        
          <NotificationBell />
          <Button variant="ghost">
            <Link href={"/dashboard/profile/chat"}><IoChatboxOutline /></Link>
          </Button>
          
       

        {/* User Avatar */}
        <Link href="/dashboard/profile">
          <Avatar>
            <AvatarImage src={profile?.profileImage || "/default-avatar.png"} />
            <AvatarFallback>
              {profile?.username ? profile.username.slice(0, 2).toUpperCase() : "NA"}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
        >
          <Menu />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="absolute top-14 left-0 w-full bg-[#101a23] border-t border-[#223649] flex flex-col items-start px-6 py-4 gap-4 md:hidden z-50">
          <Link href="#" className="hover:text-blue-400">Home</Link>
          <Link href="#" className="hover:text-blue-400">Create <IoIosAdd /></Link>
        </nav>
      )}
    </header>
  );
}
