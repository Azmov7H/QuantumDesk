"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; // <-- استخدام tokenStore

// Components
import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/landing/Hero"), { ssr: false });
const Saying = dynamic(() => import("@/components/landing/Saying"), { ssr: false });
const Featured = dynamic(() => import("@/components/landing/Featured"), { ssr: false });
const Empowering = dynamic(() => import("@/components/landing/Empowering"), { ssr: false });

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect user if token exists in api.tokenStore
    const token = api.token.get();
    if (token) router.push("/dashboard");
  }, [router]);

  return (
    <main className="container mx-auto flex flex-col gap-16 py-8 px-4 sm:px-6 md:px-12">
      {/* SEO: Ensure page has a main heading and descriptive sections */}
      <h1 className="sr-only">QuantumLeap — Publish theories and collaborate</h1>
      <Hero />
      <Empowering />
      <Featured />
      <Saying />
    </main>
  );
}
