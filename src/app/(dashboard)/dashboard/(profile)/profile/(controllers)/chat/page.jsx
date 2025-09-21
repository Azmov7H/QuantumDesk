"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token") 
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setChats(data)
      } catch (err) {
        console.error("Failed to fetch chats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchChats()
  }, [])

  if (loading) {
    return <div className="p-4">Loading chats...</div>
  }

  return (
    <div className="flex h-[90vh] w-full p-4">
      {/* Sidebar - Chat list only */}
      <Card className="w-full rounded-2xl gap-3 shadow-md">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="p-2">
            <Input placeholder="Search..." className="rounded-xl" />
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {chats.length === 0 ? (
                <div className="text-center gap-3 text-muted-foreground mt-10">
                  No chats yet
                </div>
              ) : (
                chats.map((chat) => (
                  <Button
                    key={chat._id}
                    variant="ghost"
                    className="flex items-center gap-3 justify-start rounded-none mb-3 p-4"
                    onClick={() =>
                      router.push(`/dashboard/profile/chat/${chat._id}`)
                    }
                  >
                    <Avatar>
                      <AvatarImage src={chat.user?.profileImage} />
                      <AvatarFallback>
                        {chat.user?.username?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="font-semibold">
                        {chat.user?.username}
                      </span>
                      <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {chat.lastMessage || "No messages yet"}
                      </span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
