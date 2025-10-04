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
  const [followLoading, setFollowLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  // 🟢 Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("User not found")
        const data = await res.json()
        setUser(data)

        // هل اليوزر الحالي متابع هذا الشخص؟
        const authId = JSON.parse(atob(token.split(".")[1])).id
        setIsFollowing(data.followers.includes(authId))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchUser()
  }, [id])

  // 🔵 Follow / Unfollow handler
  const handleFollow = async () => {
    try {
      setFollowLoading(true)
      const token = localStorage.getItem("token")

      const endpoint = isFollowing
        ? `${process.env.NEXT_PUBLIC_URL_API}/users/${id}/unfollow`
        : `${process.env.NEXT_PUBLIC_URL_API}/users/${id}/follow`

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to update follow state")
      const data = await res.json()

      // تحديث الحالة
      setUser(data.user)
      setIsFollowing(!isFollowing)
    } catch (err) {
      alert("❌ " + err.message)
    } finally {
      setFollowLoading(false)
    }
  }

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

          {/* Buttons: Follow + Chat */}
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleFollow}
              disabled={followLoading}
              variant={isFollowing ? "secondary" : "default"}
              className="w-full"
            >
              {followLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button
              onClick={handleChat}
              disabled={chatLoading}
              className="w-full"
            >
              {chatLoading ? "Opening..." : "Message"}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-between w-full gap-4 mt-4">
            <div className="flex-1 text-center border rounded-lg p-2">
              <p className="text-lg font-bold">{user.postsCount || 0}</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="flex-1 text-center border rounded-lg p-2">
              <p className="text-lg font-bold">{user.followers?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="flex-1 text-center border rounded-lg p-2">
              <p className="text-lg font-bold">{user.following?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
