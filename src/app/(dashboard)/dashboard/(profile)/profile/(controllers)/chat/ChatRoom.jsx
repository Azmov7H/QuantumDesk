"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function ChatRoom({ chatId, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!chatId) return;
    socket = io(process.env.NEXT_PUBLIC_URL_API.replace("/api", ""));

    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    const fetchMessages = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();

    return () => socket.disconnect();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ chatId, content: input }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, data]);
    socket.emit("sendMessage", { chatId, message: data });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded-lg w-max ${msg.sender._id === userId ? "bg-blue-600 ml-auto" : "bg-gray-700"}`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg bg-[#362447] border-none outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
