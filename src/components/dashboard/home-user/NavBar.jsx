"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { Menu, PlusCircle, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import NotificationBell from "@/components/notifications/page";
import Logo from "@/components/landing/Logo";

export default function Navbar() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch user profile once on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <div className="text-red-500 px-4">{error}</div>;
  if (!profile) return <div className="text-gray-400 px-4">Loading...</div>;

  return (
    <header className="flex items-center justify-between border-b border-[#223649] px-4 md:px-6 py-3 text-white relative bg-[#101a23] z-50">
      {/* Left: Logo + Desktop Actions */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard/newposts"
            className="p-2 rounded-full hover:bg-[#223649] transition-colors"
          >
            <PlusCircle size={24} />
          </Link>
          <Link
            href="/dashboard/chat"
            className="p-2 rounded-full hover:bg-[#223649] transition-colors"
          >
            <MessageSquare size={24} />
          </Link>
        </div>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 hidden md:flex justify-center px-4">
        <div className="flex items-center w-full max-w-md bg-[#223649] rounded-xl h-10">
          <span className="px-3 text-[#90adcb]">
            <BsSearch />
          </span>
          <Input
            placeholder="Search..."
            className="bg-[#223649] text-white rounded-r-xl focus:ring-2 focus:ring-[#3b82f6]"
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
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu />
        </Button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-[#101a23] border-t border-[#223649] flex flex-col items-start px-6 py-4 gap-4 md:hidden">
          <Link
            href="/dashboard/new-post"
            className="flex items-center gap-2 p-2 hover:bg-[#223649] rounded transition-colors w-full"
          >
            <PlusCircle size={20} /> New Post
          </Link>
          <Link
            href="/dashboard/chat"
            className="flex items-center gap-2 p-2 hover:bg-[#223649] rounded transition-colors w-full"
          >
            <MessageSquare size={20} /> Messages
          </Link>
        </nav>
      )}
    </header>
  );
}
