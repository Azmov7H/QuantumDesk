"use client"

import React, { useState } from "react"
import Logo from "./Logo"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const Links = [
  { id: 1, title: "Home", href: "/" },
  { id: 2, title: "Features", href: "/features" },
  { id: 3, title: "Pricing", href: "/pricing" },
  { id: 4, title: "Support", href: "/support" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className=" px-4 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <div className="logo">
        <Logo />
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {Links.map((link) => (
          <Link key={link.id} href={link.href} className="hover:text-blue-600 transition">
            {link.title}
          </Link>
        ))}
        <Button className="bg-[#1A8CE5] text-white" variant="ghost">
          <Link href="/auth/login">Get Started</Link>
        </Button>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden z-20">
        <button onClick={() => setOpen(!open)} className="focus:outline-none">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-[#172633] shadow-md flex flex-col items-start gap-4 p-4 md:hidden z-10">
          {Links.map((link) => (
            <Link key={link.id} href={link.href} onClick={() => setOpen(false)} className="text-lg hover:text-blue-600 transition">
              {link.title}
            </Link>
          ))}
          <Button className="bg-[#1A8CE5] text-white w-full md:w-4/5" variant="ghost" onClick={() => setOpen(false)}>
            <Link href="/auth/login">Get Started</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}
