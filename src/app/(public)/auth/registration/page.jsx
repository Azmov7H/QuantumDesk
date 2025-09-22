"use client"

import { useState } from "react"
import { registerUser } from "@/lib/api"
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
  const [username, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await registerUser({ username, email, password })
      toast.success("Account created successfully!")
      router.push("/auth/login")
    } catch (err) {
      toast.error(err.message)
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
        style={{ borderRadius: 16 }}>
      <Card className="w-full h-full !bg-white/10 !backdrop-blur-md !border !border-white/20 gap-4 p-3">
        <CardHeader>
          <CardTitle className={'text-white'}>Create an account</CardTitle>
          <CardDescription>Enter your details below to register</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="gap-2">
              <Input
                id="name"
                type="text"
                value={username}
                className={'text-white'}
                placeholder="Username"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className=" flex flex-col gap-2">

              <Input
                id="email"
                type="email"
                value={email}
                className={'text-white'}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-2">
              <Input
                id="password"
                type="password"
                value={password}
                className={'text-white'}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A8CE5] text-white"
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
