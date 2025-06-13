"use client"
import { useState } from "react"
import { loginUser } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
    Card, CardAction, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const data = await loginUser({ email, password })
            cookies().set("token", token, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                httpOnly: false, // يمكن قراءته من document.cookie
            })

            console.log("Login success:", data)

            router.push("/dashboard")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex w-full items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="link">Sign Up</Button>
                    </CardAction>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
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
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    </CardContent>

                    <CardFooter className="flex-col gap-2">
                        <Button
                            variant={"ghost"}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1A8CE5] text-white"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <Button variant="ghost" className="w-full">
                            Login with Google
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
