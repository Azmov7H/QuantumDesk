// app/components/dashboard/sidebar.jsx
"use client";
import Link from "next/link";
import { Home, FileText, MessageCircle, Bell, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/posts", icon: FileText, label: "My Posts" },
  { href: "/dashboard/comments", icon: MessageCircle, label: "Comments" },
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 p-4 border-r bg-background">
      <nav className="space-y-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 p-2 rounded hover:bg-muted"
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
