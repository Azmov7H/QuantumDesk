'use client';

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

let socketInstance = null;

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    // API مباشر
    const API_BASE = process.env.NEXT_PUBLIC_URL_API
    const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // fetch messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE}/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
        const other = data.find((m) => m.sender?._id !== userId)?.sender;
        if (other) setOtherUser(other);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    // setup socket
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      });
    }
    const socket = socketInstance;

    socket.on("connect", () => {
      setSocketConnected(true);
      socket.emit("user_connected", userId);
      socket.emit("joinChat", chatId);
    });

    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender?._id !== userId) setOtherUser(msg.sender);
    });

    return () => {
      socket.emit("leaveChat", chatId);
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const userId = localStorage.getItem("userId");
    const chatContent = newMessage;
    setNewMessage("");

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      chat: chatId,
      sender: { _id: userId, username: "You" },
      content: chatContent,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ chatId, content: chatContent }),
      });
      const saved = await res.json();
      setMessages((prev) => prev.map((m) => (m._id === tempId ? saved : m)));
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1724] p-4">
      <Card className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl shadow-lg">
        <CardContent className="flex flex-col h-[80vh] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center">
                <img
                  src={otherUser?.profileImage || "/default-avatar.png"}
                  alt={otherUser?.username || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white font-semibold">
                  {otherUser?.username || "Conversation"}
                </div>
                <div className="text-xs text-zinc-300">
                  {socketConnected ? (
                    <span className="text-emerald-400">Connected</span>
                  ) : (
                    <span className="text-yellow-300">Connecting...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto p-2 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div className="flex flex-col gap-3 py-2">
              {messages.map((msg) => {
                const sender = msg.sender || {};
                const isMe = sender._id === localStorage.getItem("userId");
                return (
                  <div
                    key={msg._id}
                    className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-zinc-600">
                        <img src={sender.profileImage || "/default-avatar.png"} alt={sender.username} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-3 max-w-[72%] text-sm ${isMe ? "bg-blue-600 text-white" : "bg-zinc-800 text-white"}`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {!isMe && <div className="text-xs text-zinc-300 mb-1 font-semibold">{sender.username}</div>}
                      <div>{msg.content}</div>
                                            <div className="mt-1 text-[10px] opacity-60 text-right">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        {msg.optimistic ? " • sending..." : ""}
                      </div>
                    </div>

                    {isMe && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-blue-700">
                        <img
                          src="/default-avatar.png"
                          alt="You"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            />
            <Button onClick={sendMessage} disabled={!socketConnected}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

