"use client";
import React, { useState } from "react";

export default function NewChat({ refreshChats }) {
  const [email, setEmail] = useState("");

  const createChat = async () => {
    if (!email.trim()) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userId: email }),
    });
    const data = await res.json();
    setEmail("");
    refreshChats?.();
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="User ID"
        className="flex-1 p-2 rounded-md bg-[#362447] border-none"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button className="px-4 bg-purple-700 rounded-md" onClick={createChat}>
        New Chat
      </button>
    </div>
  );
}
