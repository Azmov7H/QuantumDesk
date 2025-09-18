"use client";
import React, { useEffect, useState } from "react";

export default function ChatContacts({ setSelectedChat, selectedChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/chats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setChats(data);
    };
    fetchChats();
  }, []);

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px]">
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => setSelectedChat(chat)}
          className={`p-2 rounded-lg cursor-pointer ${selectedChat?._id === chat._id ? "bg-blue-600" : "bg-gray-700"}`}
        >
          <p>{chat.users.map((u) => u.username).join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
