"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import { Menu, PlusCircle, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import NotificationBell from "@/components/notifications/page";
import Logo from "@/components/landing/Logo";
import SNavbar from "./sNavbar";

const GUEST_PROFILE = {
  username: "Guest",
  _id: "guest",
  profileImage: "/default-avatar.png",
};

export default function Navbar() {
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const res = await api.auth.getProfile();
        if (!res.ok) {
          localStorage.removeItem("token");
          if (mounted) setProfile(GUEST_PROFILE);
          return;
        }
        if (mounted) setProfile(res.data);
      } catch {
        localStorage.removeItem("token");
        if (mounted) setProfile(GUEST_PROFILE);
      }
    };

    if (!profile) fetchProfile();

    return () => { mounted = false; };
  }, [profile]);

  if (!profile) return <SNavbar />;

  const isGuest = profile._id === "guest";

  return (
    <header className="flex items-center justify-between border-b border-[#223649] px-4 md:px-6 py-3 text-white bg-[#101a23] relative z-50">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <Logo />
        </Link>

        {!isGuest && (
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard/newposts" className="p-2 rounded-full hover:bg-[#223649] transition-colors">
              <PlusCircle size={24} />
            </Link>
            <Link href="/dashboard/chat" className="p-2 rounded-full hover:bg-[#223649] transition-colors">
              <MessageSquare size={24} />
            </Link>
          </div>
        )}
      </div>

      <div className="flex-1 hidden md:flex justify-center px-4">
        <div className="flex items-center w-full max-w-md bg-[#223649] rounded-xl h-10">
          <span className="px-3 text-[#90adcb]"><BsSearch /></span>
          <Input placeholder="Search..." className="bg-[#223649] text-white rounded-r-xl focus:ring-2 focus:ring-[#3b82f6]" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isGuest && <NotificationBell />}

        <Link href={isGuest ? "/auth/login" : "/dashboard/profile"}>
          <Avatar>
            <AvatarImage src={profile.profileImage} />
            <AvatarFallback>{profile.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>

        {!isGuest && (
          <Button variant="ghost" size="icon" className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu />
          </Button>
        )}
      </div>

      {!isGuest && menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-[#101a23] border-t border-[#223649] flex flex-col items-start px-6 py-4 gap-4 md:hidden">
          <Link href="/dashboard/newposts" className="flex items-center gap-2 p-2 hover:bg-[#223649] rounded transition-colors w-full">
            <PlusCircle size={20} /> New Post
          </Link>
          <Link href="/dashboard/chat" className="flex items-center gap-2 p-2 hover:bg-[#223649] rounded transition-colors w-full">
            <MessageSquare size={20} /> Messages
          </Link>
        </nav>
      )}
    </header>
  );
}
