"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getSocket } from "@/lib/socket"

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState(null)
  const router = useRouter()

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    } catch (err) {
      console.error("❌ Fetch notifications error:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`${process.env.NEXT_PUBLIC_URL_API}/notifications/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("❌ Mark as read error:", err)
    }
  }

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read) {
        const token = localStorage.getItem("token")
        await fetch(`${process.env.NEXT_PUBLIC_URL_API}/notifications/${notif._id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        })
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        )
        setUnreadCount((prev) => prev - 1)
      }

      // ✅ التوجيه حسب نوع الإشعار
      if (notif.chat?._id) {
        router.push(`/chats/${notif.chat._id}`)
      } else if (notif.post?._id) {
        router.push(`/posts/${notif.post._id}`)
      } else {
        console.log("⚠️ Unknown notification type:", notif)
      }
    } catch (err) {
      console.error("❌ Error handling notif click:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()

    try {
      const s = getSocket()
      setSocket(s)

      const token = localStorage.getItem("token")
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]))
        s.emit("register", payload.id)
      }

      s.on("receive_notification", (notif) => {
        setNotifications((prev) => [notif, ...prev])
        setUnreadCount((prev) => prev + 1)
      })

      return () => {
        s.off("receive_notification")
      }
    } catch (err) {
      console.error("❌ Socket init error:", err)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mr-6">
        <DropdownMenuLabel className="flex justify-between items-center">
          Notifications
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif._id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex items-center gap-3 cursor-pointer ${
                !notif.read ? "bg-muted" : ""
              }`}
            >
              <Avatar>
                <AvatarImage src={notif.fromUser?.profileImage} />
                <AvatarFallback>{notif.fromUser?.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{notif.message}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(notif.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No notifications yet</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
