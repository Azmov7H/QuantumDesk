"use client";
import { useEffect, useState } from "react";
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
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (data) setProfile(data);
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
