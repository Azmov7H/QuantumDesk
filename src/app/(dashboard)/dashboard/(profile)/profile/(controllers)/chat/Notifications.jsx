"use client";
import React, { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/notifications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="mt-4 flex flex-col gap-2 max-h-[200px] overflow-y-auto">
      <h3 className="text-gray-400 mb-2">Notifications</h3>
      {notifications.map((n) => (
        <div key={n._id} className={`p-2 rounded-lg ${n.read ? "bg-gray-700" : "bg-green-600"}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
