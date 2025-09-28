"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/auth/login");
      return;
    }
    setToken(t);

    // Fetch profile
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed"))
      .then(setProfile)
      .catch(() => router.push("/auth/login"));

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/notifications`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      } catch (err) { console.error(err); }
    };
    fetchNotifications();

    // Socket
    const s = getSocket();
    const payload = JSON.parse(atob(t.split(".")[1]));
    s.emit("register", payload.id);
    s.on("receive_notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => s.off("receive_notification");
  }, [router]);

  return (
    <DashboardContext.Provider value={{ profile, token, notifications, setNotifications, unreadCount, setUnreadCount }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
