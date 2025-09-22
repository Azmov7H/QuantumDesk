import Link from "next/link"
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi"

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-white">QuantumDesk</span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/explore" className="hover:text-white">Explore</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/profile" className="hover:text-white">Profile</Link>
        </div>

        {/* Social icons */}
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FiGithub size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FiTwitter size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FiLinkedin size={20} />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} QuantumDesk. All rights reserved.
      </div>
    </footer>
  )
}
