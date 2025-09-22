// src/components/nav/Logo.jsx
"use client"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow">
        QL
      </div>
      <span className="hidden sm:inline-block font-semibold text-lg">QuantumLeap</span>
    </Link>
  )
}
