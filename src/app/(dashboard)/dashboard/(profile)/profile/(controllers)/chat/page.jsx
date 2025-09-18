"use client";

import React, { useEffect, useState, useRef } from "react";
import ChatContacts from "./ChatContacts";
import ChatRoom from "./ChatRoom";
import NewChat from "./NewChat";
import { Input } from "@/components/ui/input";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_URL_API.replace("/api", ""); // قاعدة الـ WebSocket
let socket;

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // تهيئة Socket
  useEffect(() => {
    socket = io(SOCKET_URL);
    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("receiveMessage", (message) => {
      if (currentChat && message.chat === currentChat._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentChat]);

  // جلب الشاتس من الباك
  useEffect(() => {
    const fetchChats = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/chats`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setChats(data);
    };
    fetchChats();
  }, []);

  // جلب الرسائل عند اختيار شات
  useEffect(() => {
    if (!currentChat) return;
    const fetchMessages = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/messages/${currentChat._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, [currentChat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // إرسال رسالة
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: currentChat._id, content: newMessage }),
    });
    const message = await res.json();
    setMessages((prev) => [...prev, message]);
    socket.emit("sendMessage", message); // إشعار عبر WebSocket
    setNewMessage("");
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-4 h-[calc(100vh-2rem)]">
      {/* قائمة الشاتات */}
      <div className="w-full md:w-1/3 bg-[#362447] p-4 rounded-lg flex flex-col gap-4">
        <Input
          placeholder="Search..."
          className="bg-[#2B1F3B] border-none text-white placeholder:text-gray-400"
        />
        <NewChat chats={chats} setChats={setChats} />
        <ChatContacts
          chats={chats}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
        />
      </div>

      {/* غرفة المحادثة */}
      <div className="w-full md:w-2/3 bg-[#1E1A29] p-4 rounded-lg flex flex-col h-full">
        {currentChat ? (
          <>
            <ChatRoom messages={messages} />
            <div className="mt-auto flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-[#6C63FF] rounded-lg text-white"
              >
                Send
              </button>
            </div>
            <div ref={messagesEndRef}></div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
