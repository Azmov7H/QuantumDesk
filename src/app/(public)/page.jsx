// src/app/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import Hero from "@/components/landing/Hero"
import Saying from "@/components/landing/Saying"
import Featured from "@/components/landing/Featured"
import Empowering from "@/components/landing/Empowering"

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect user if token exists
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  return (
    <main className="container mx-auto flex flex-col gap-16 py-8 px-4 sm:px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white">
      <Hero />
      <Empowering />
      <Featured />
      <Saying />
    </main>
  );
}
