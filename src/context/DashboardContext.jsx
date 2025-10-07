"use client"

import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const t = api.token.get();
    if (!t) {
      router.push("/auth/login");
      return;
    }
    setToken(t);
    try { setCurrentUserId(jwtDecode(t)?.id || null); } catch { setCurrentUserId(null); }

    // Fetch profile
    api.auth.getProfile()
      .then(res => res.ok ? setProfile(res.data) : Promise.reject("Failed"))
      .catch(() => router.push("/auth/login"));

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await api.notifications.list();
        const data = res.ok ? res.data : [];
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      } catch (err) { console.error(err); }
    };
    fetchNotifications();

    // Socket
    api.initRealtime();
    api.subscribe("receive_notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    // unsubscribe handled via api if needed
    return () => {};
  }, [router]);

  return (
    <DashboardContext.Provider value={{ profile, token, notifications, setNotifications, unreadCount, setUnreadCount, currentUserId }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
