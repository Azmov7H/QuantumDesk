// app/(dashboard)/dashboard/notifications/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li key={n._id} className="p-3 rounded border bg-card">
            <p>{n.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
