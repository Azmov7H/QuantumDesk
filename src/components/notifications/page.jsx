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
import { useDashboard } from "@/context/DashboardContext";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { currentUserId } = useDashboard?.() || {};

  useEffect(() => {
    let unsub; // للاحتفاظ بالـ unsubscribe
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await api.notifications.list();
        if (res.ok && Array.isArray(res.data)) {
          if (!mounted) return;
          setNotifications(res.data);
          setUnreadCount(res.data.filter((n) => !n.read).length);
        } else {
          console.warn("⚠️ Failed to load notifications", res.error);
        }
      } catch (err) {
        console.error("❌ Fetch notifications error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const initRealtime = async () => {
      if (api.initRealtime) {
        await api.initRealtime();
        unsub = api.subscribe("receive_notification", (notif) => {
          // تجاهل الإشعارات المرسلة من نفس المستخدم
          if (notif?.fromUser?._id === currentUserId) return;
          setNotifications((prev) => [notif, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
      }
    };

    fetchNotifications();
    initRealtime();

    return () => {
      mounted = false;
      if (unsub) unsub(); // تنظيف الاشتراك
    };
  }, [currentUserId]);

  // ✅ تعليم كل الإشعارات كمقروءة
  const markAllAsRead = async () => {
    const res = await api.notifications.markAllRead();
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } else {
      console.error("❌ Mark all read failed", res.error);
    }
  };

  // ✅ عند الضغط على إشعار معين
  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      const res = await api.notifications.markRead(notif._id);
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    }

    if (notif.chat) router.push(`/dashboard/chat/${notif.chat}`);
    else if (notif.post) router.push(`/dashboard/posts/${notif.post}`);
  };

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

        {loading ? (
          <DropdownMenuItem>Loading notifications...</DropdownMenuItem>
        ) : notifications.length > 0 ? (
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
                <AvatarFallback>
                  {notif.fromUser?.username?.[0] || "U"}
                </AvatarFallback>
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
