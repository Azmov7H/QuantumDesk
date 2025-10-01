"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import UserData from "../components/UserData"

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
    <>
    <div className="flex justify-center bg-transparent ">
      <div className=" w-4/5 mx-auto shadow-xl rounded-2xl">
        <div className="flex flex-col items-center gap-6 p-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.profileImage} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>

          {/* Username & Email */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl text-white font-bold">{user.username}</h2>
            <p className="text-sm text-[#AD91C9]">{user.email}</p>
          </div>

          {/* Chat Button */}
          <Button
            onClick={handleChat}
            disabled={chatLoading}
            className="w-full bg-[#362447] text-white"
          >
            {chatLoading ? "Opening chat..." : "Follow"}
          </Button>

          {/* Stats */}
          <div className="flex justify-between w-full gap-4 mt-4 text-white ">
            <div className="flex-1 text-center border border-[#AD91C9] rounded-lg p-6">
              <p className="text-lg text-white font-bold mb-6 ">125</p>
              <p className="text-md text-[#AD91C9]">Posts</p>
            </div>
            <div className="flex-1 text-center border border-[#AD91C9] rounded-lg p-6">
              <p className="text-lg text-white font-bold mb-6">342</p>
              <p className="text-md text-[#AD91C9]">Followers</p>
            </div>
            <div className="flex-1 text-center border border-[#AD91C9] rounded-lg p-6">
              <p className="text-lg text-white font-bold mb-6">578</p>
              <p className="text-md text-[#AD91C9]">Citations</p>
            </div>
          </div>
        </div>
      </div>

    
    </div>
    <div className=" w-4/5 mx-auto">
      <UserData />
    </div>

</>
  )
}
