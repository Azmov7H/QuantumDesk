"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/profiel-user/DashboardHeader";
import DashboardStats from "@/components/dashboard/profiel-user/DashboardStats";
import RecentActivity from "@/components/dashboard/profiel-user/RecentActivity";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: "Projects", value: 12 },
    { label: "Tasks", value: 34 },
    { label: "Messages", value: 7 },
  ];

  useEffect(() => {
    api.auth.getProfile()
      .then((res) => {
        if (res.ok) setProfile(res.data);
        else if (res.status === 401 || res.status === 403) localStorage.removeItem("token");
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setError("Something went wrong, please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-400 p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="flex flex-col gap-6 bg-[#101a23]">
      <DashboardHeader user={profile?.username ?? "Guest"} />
      <DashboardStats stats={stats} />
      <RecentActivity />
    </div>
  );
}
