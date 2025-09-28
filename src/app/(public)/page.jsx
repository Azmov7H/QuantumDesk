// src/app/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import Hero from "@/components/comp/Hero";
import Empowering from "@/components/comp/Empowering";
import Featured from "@/components/comp/Featured";
import Saying from "@/components/comp/Saying";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect user if token exists
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  return (
    <main className="container mx-auto flex flex-col gap-16 py-8 px-4 sm:px-6 md:px-12">
      <Hero />
      <Empowering />
      <Featured />
      <Saying />
    </main>
  );
}
