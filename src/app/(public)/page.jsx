// src/app/page.jsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import Empowering from "../../components/comp/Empowering"
import Featured from "../../components/comp/Featured"
import Hero from "../../components/comp/Hero"
import Saying from "../../components/comp/Saying"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // التوكن موجود في localStorage (ممكن تستخدم cookies برضو)
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard") // توجيه المستخدم مباشرة
    }
  }, [router])

  return (
    <main className="container mx-auto px-4 flex flex-col gap-16 py-8">
      <Hero />
      <Empowering />
      <Featured />
      <Saying />
    </main>
  )
}
