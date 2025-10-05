"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHydrated(true);

    // 1️⃣ جلب الإشعارات عبر API
    const fetchNotifications = async () => {
      const res = await api.notifications.list();
      if (res.ok) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.read).length);
      } else {
        console.error("❌ Fetch notifications failed", res.error);
      }
    };

    fetchNotifications();

    // 2️⃣ تهيئة Socket.io realtime
    api.initRealtime().then(() => {
      // 3️⃣ الاشتراك في أي إشعار جديد
      const unsub = api.subscribe("receive_notification", (notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => unsub(); // تنظيف الاشتراك عند unmount
    });
  }, []);

  const markAllAsRead = async () => {
    const res = await api.notifications.markAllRead();
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } else {
      console.error("❌ Mark all read failed", res.error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      const res = await api.notifications.markRead(notif._id);
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => prev - 1);
      }
    }

    if (notif.chat) router.push(`/chats/${notif.chat}`);
    else if (notif.post) router.push(`/posts/${notif.post}`);
    else console.log("⚠️ Unknown notification type:", notif);
  };

  if (!hydrated) return null;

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
                <AvatarImage src={notif.fromUser?.profileImage || ""} />
                <AvatarFallback>{notif.fromUser?.username?.[0] || "U"}</AvatarFallback>
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
  );
}
