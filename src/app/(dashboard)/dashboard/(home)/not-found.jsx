// src/app/not-found.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      
      {/* Animated radial background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A8CE5,_transparent_70%)]"
      />

      {/* Main content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center px-6"
      >
        <h1 className="text-[6rem] md:text-[8rem] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-lg">
          404
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-300 max-w-lg">
          Oops! The page you’re looking for doesn’t exist, or it might have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-cyan-500/40"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-gray-500 px-6 py-3 font-semibold text-gray-300 hover:text-white hover:border-cyan-400 transition"
          >
            Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Animated circle */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full border border-cyan-500/20 blur-2xl"
      />
    </div>
  );
}
