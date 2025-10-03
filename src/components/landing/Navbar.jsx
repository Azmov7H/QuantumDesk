"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

// Desktop & Mobile Links
const Links = [
  { id: 1, title: "Home", href: "/" },
  { id: 2, title: "Features", href: "/features" },
  { id: 3, title: "Pricing", href: "/pricing" },
  { id: 4, title: "Support", href: "/support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="px-4 py-3 flex items-center justify-between relative dark:bg-[#172633] shadow-lg z-50">
      {/* Logo */}
      <Logo />

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {Links.map(link => (
          <Link
            key={link.id}
            href={link.href}
            className="hover:text-blue-500 transition"
          >
            {link.title}
          </Link>
        ))}
        <Button className="bg-[#1A8CE5] text-white" variant="default">
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden z-50 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle Menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#172633] shadow-md flex flex-col items-start gap-4 p-6 transition-all duration-300 ${
          open ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        {Links.map(link => (
          <Link
            key={link.id}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-lg w-full hover:text-blue-500 transition"
          >
            {link.title}
          </Link>
        ))}
        <Button
          className="bg-[#1A8CE5] text-white w-full mt-2"
          variant="default"
          onClick={() => setOpen(false)}
        >
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
}
