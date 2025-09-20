"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import io from "socket.io-client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

let socket

export default function ChatPage() {
  const { id } = useParams() // chatId
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)

  // 🟢 Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) throw new Error("Failed to load messages")
        const data = await res.json()
        setMessages(data)
      } catch (err) {
        console.error("❌ error fetching messages:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchMessages()
  }, [id])

  // 🟢 Socket.io setup
  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    })

    socket.emit("joinChat", id)

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.disconnect()
    }
  }, [id])

  // 🟢 Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageData = {
      chatId: id,
      content: newMessage,
    }

    socket.emit("sendMessage", messageData)

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        sender: { username: "Me", profileImage: null },
        createdAt: new Date().toISOString(),
      },
    ])

    setNewMessage("")
  }

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (loading) return <div className="p-10 text-white">Loading chat...</div>

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md shadow-xl rounded-2xl">
        <CardContent className="flex flex-col h-[80vh] p-4">
          {/* Messages area */}
          <ScrollArea className="flex-1 p-2">
            <div className="flex flex-col gap-3">
              {messages.map((msg, i) => {
                const isMe = msg.sender?.username === "Me"
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar */}
                    {!isMe && (
                      msg.sender?.profileImage ? (
                        <Image
                          src={msg.sender.profileImage}
                          alt={msg.sender.username}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm">
                          {msg.sender?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                      )
                    )}

                    {/* Message bubble */}
                    <div
                      className={`p-2 rounded-xl max-w-[70%] ${
                        isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-xs opacity-70 block mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    {/* Avatar for me (right side) */}
                    {isMe && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                        M
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
