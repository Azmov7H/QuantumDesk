"use client"

import Link from "next/link"
import { useState } from "react"
import { loginUser } from "@/lib/api"
import { Button } from "@/components/ui/button"
import ElectricBorder from "@/components/ElectricBorder"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

 const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    const data = await loginUser({ email, password })

    if (!data?.token) {
      throw new Error("Token not found in response")
    }

    localStorage.setItem("token", data.token)
    toast.success("Login successful")

    router.push("/dashboard")
  } catch (err) {
    console.error("Login error:", err)
    toast.error(err?.response?.data?.message || err.message || "Login failed")
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="flex min-h-screen items-center justify-center">
      <ElectricBorder
        className="flex items-center justify-center w-full max-w-md p-2"
        color="#7df9ff"
        speed={1}
        chaos={0.5}
        thickness={2}
        style={{ borderRadius: 16 }}
      >
        <Card className="w-full !bg-white/10 !backdrop-blur-md !border !border-white/20 gap-3">
          <CardHeader>
            <CardTitle className={'text-white'}>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <div className="mt-2">
              <Button variant="link" asChild>
                <Link href="/auth/registration" className={'text-white'}>Sign Up</Link>
              </Button>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className={'text-white'}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="password" className={'text-white'}>Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-gray-400 inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A8CE5] text-white hover:bg-[#1573be]"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </Card>
      </ElectricBorder>
    </div>
  )
}
