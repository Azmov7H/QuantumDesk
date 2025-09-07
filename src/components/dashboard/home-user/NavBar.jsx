"use client"
import Link from "next/link"

export default function Navbar() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#223649] px-10 py-3">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold">QuantumLeap</h2>
        </div>

        {/* Links */}
        <div className="flex items-center gap-9">
          <Link className="text-white text-sm font-medium" href="#">Home</Link>
          <Link className="text-white text-sm font-medium" href="#">Explore</Link>
          <Link className="text-white text-sm font-medium" href="#">My Library</Link>
          <Link className="text-white text-sm font-medium" href="#">Create</Link>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 justify-end gap-8">
        {/* Search */}
        <label className="flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex items-stretch rounded-xl h-full bg-[#223649]">
            <div className="text-[#90adcb] flex items-center pl-4">
              🔍
            </div>
            <input
              placeholder="Search"
              className="flex-1 bg-[#223649] text-white px-4 focus:outline-none rounded-r-xl"
            />
          </div>
        </label>

        {/* Notification */}
        <button className="rounded-xl h-10 bg-[#223649] text-white px-3">
          🔔
        </button>

        {/* User Avatar */}
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full size-10"
          style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/...")` }}
        />
      </div>
    </header>
  )
}
