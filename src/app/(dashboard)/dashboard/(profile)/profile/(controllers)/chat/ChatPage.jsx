"use client";
import React, { useEffect, useState } from "react";
import ChatContacts from "./ChatContacts";
import ChatRoom from "./ChatRoom";
import Notifications from "./Notifications";
import NewChat from "./NewChat";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const user = JSON.parse(atob(token.split(".")[1])); // assuming JWT
    setUserId(user.id);
  }, []);

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <div className="w-full md:w-1/3 bg-[#2B2540] p-4 rounded-lg flex flex-col">
        <Input placeholder="Search" className="mb-4 bg-[#362447] border-none" />
        <NewChat setSelectedChat={setSelectedChat} />
        <ChatContacts setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
        <Notifications />
      </div>
      <div className="w-full md:w-2/3 bg-[#1F1B33] p-4 rounded-lg flex flex-col">
        {selectedChat ? (
          <ChatRoom chatId={selectedChat._id} userId={userId} />
        ) : (
          <p className="text-gray-400">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}
