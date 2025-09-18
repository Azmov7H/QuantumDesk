"use client";

// DesktopSidebar.js
import Link from "next/link";
import { Home, FileText, Plus, MessageCircle, User, Settings } from "lucide-react";

export default function DesktopSidebar() {
  const menuItems = [
    { label: "Home", icon: Home, path: "/dashboard/profile" },
    { label: "My Posts", icon: FileText, path: "/dashboard/profile/Myposts" },
    { label: "New Post", icon: Plus, path: "/dashboard/profile/newposts" },
    { label: "Chat", icon: MessageCircle, path: "/dashboard/profile/chat" },
    { label: "Profile", icon: User, path: "/dashboard/profile" },
    { label: "Settings", icon: Settings, path: "/dashboard/profile/settings" },
  ];

  return (
    <div className="flex flex-col justify-between bg-[#101a23] p-4 min-h-full">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#223649] text-white"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
