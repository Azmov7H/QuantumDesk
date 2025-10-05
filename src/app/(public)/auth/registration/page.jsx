"use client"

import { useState } from "react"
import api from "@/lib/api" // <-- الاعتماد الكامل على api.js
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import ElectricBorder from "@/components/ElectricBorder"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatarFile, setAvatarFile] = useState(null) // optional
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // -----------------------------
  // Handle registration using api.js
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // payload compatible with api.auth.register
      const payload = { name: username, email, password }
      if (avatarFile) payload.avatarFile = avatarFile

      const res = await api.auth.register(payload)

      if (!res.ok) {
        throw new Error(res.error || "Registration failed")
      }

      toast.success("Account created successfully!")

      // التوجيه للـ login بعد التسجيل
      router.push("/auth/login")
    } catch (err) {
      console.error("Registration error:", err)
      toast.error(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full h-full items-center justify-center">
      <ElectricBorder
        className="flex items-center h-full justify-center w-full max-w-md p-2"
        color="#7df9ff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        <Card className="w-full h-full !bg-white/10 !backdrop-blur-md !border !border-white/20 gap-4 p-3">
          <CardHeader>
            <CardTitle className="text-white">Create an account</CardTitle>
            <CardDescription className="text-white/80">
              Enter your details below to register
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="avatar" className="text-white">Avatar (optional)</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A8CE5] text-white hover:bg-[#1573be]"
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>

              <Button
                variant="link"
                type="button"
                onClick={() => router.push("/auth/login")}
                className="w-full text-white"
              >
                Already have an account? Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </ElectricBorder>
    </div>
  )
}
