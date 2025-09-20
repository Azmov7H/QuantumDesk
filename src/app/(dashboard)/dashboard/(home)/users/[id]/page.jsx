"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function UserProfile() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [chatLoading, setChatLoading] = useState(false)

  // 🟢 Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/${id}`)
        if (!res.ok) throw new Error("User not found")
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchUser()
  }, [id])

  // Open or create chat
  const handleChat = async () => {
    try {
      setChatLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: id }),
      })
      if (!res.ok) throw new Error("Failed to open chat")
      const data = await res.json()
      router.push(`/dashboard/profile/chat/${data._id}`)
    } catch (err) {
      console.error("❌ chat error:", err)
      alert("Couldn't open chat")
    } finally {
      setChatLoading(false)
    }
  }

  if (loading) return <div className="text-white p-10">Loading...</div>
  if (error) return <div className="text-red-500 p-10">{error}</div>

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-6 p-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.profileImage} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>

          {/* Username & Email */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          {/* Chat Button */}
          <Button
            onClick={handleChat}
            disabled={chatLoading}
            className="w-full"
          >
            {chatLoading ? "Opening chat..." : "Message"}
          </Button>

          {/* Stats */}
          <div className="flex justify-between w-full gap-4 mt-4">
            <div className="flex-1 text-center border rounded-lg p-2">
              <p className="text-lg font-bold">125</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="flex-1 text-center border rounded-lg p-2">
              <p className="text-lg font-bold">342</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="flex-1 text-center border rounded-lg p-2">
              <p className="text-lg font-bold">578</p>
              <p className="text-xs text-muted-foreground">Citations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
