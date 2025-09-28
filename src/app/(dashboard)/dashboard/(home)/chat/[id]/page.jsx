"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE = process.env.NEXT_PUBLIC_URL_API;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

let socketInstance = null;

export default function ChatPage() {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const scrollRef = useRef(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const localUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  /** Fetch chat history */
  const fetchMessages = useCallback(async () => {
    if (!chatId || !token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data || []);

      const other = data.find(m => m.sender && m.sender._id !== localUserId)?.sender;
      if (other) setOtherUser(other);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [chatId, token, localUserId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /** Initialize socket */
  useEffect(() => {
    if (!chatId || !token) return;

    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, { auth: { token }, transports: ["websocket"] });
    }

    const socket = socketInstance;

    const handleConnect = () => {
      setSocketConnected(true);
      if (localUserId) socket.emit("user_connected", localUserId);
      socket.emit("joinChat", chatId);
    };

    const handleDisconnect = () => setSocketConnected(false);

    const handleNewMessage = msg => {
      setMessages(prev => (prev.some(m => m._id === msg._id) ? prev : [...prev, msg]));
      if (msg.sender && msg.sender._id !== localUserId) setOtherUser(msg.sender);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage", handleNewMessage);
    };
  }, [chatId, token, localUserId]);

  /** Scroll to bottom */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Send a new message */
  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      chat: chatId,
      sender: { _id: localUserId, username: "You", profileImage: null },
      content: text,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ chatId, content: text }),
      });
      const saved = await res.json();
      setMessages(prev => prev.map(m => (m._id === tempId ? saved : m)));
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  if (loading) return <div className="p-8 text-white">Loading chat...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1724] p-4">
      <Card className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl shadow-lg">
        <CardContent className="flex flex-col h-[80vh] p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <AvatarImage src={otherUser?.profileImage} alt={otherUser?.username} />
              <div>
                <div className="text-white font-semibold">{otherUser?.username || "Conversation"}</div>
                <div className="text-xs text-zinc-300">
                  {socketConnected
                    ? <span className="text-emerald-400">Connected</span>
                    : <span className="text-yellow-300">Connecting...</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 overflow-y-auto p-2 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div className="flex flex-col gap-3 py-2">
              {messages.map(msg => {
                const sender = msg.sender || {};
                const isMe = sender._id === localUserId;
                return (
                  <div key={msg._id || msg.createdAt} className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && <AvatarImage src={sender.profileImage} alt={sender.username} size="sm" />}
                    <div className={`rounded-2xl p-3 max-w-[72%] text-sm ${isMe ? "bg-blue-600 text-white" : "bg-zinc-800 text-white"}`} style={{ wordBreak: "break-word" }}>
                      {!isMe && <div className="text-xs text-zinc-300 mb-1 font-semibold">{sender.username}</div>}
                      <div>{msg.content}</div>
                      <div className="mt-1 text-[10px] opacity-60 text-right">
                        {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {msg.optimistic && " • sending..."}
                      </div>
                    </div>
                    {isMe && <AvatarImage src="/default-avatar.png" alt="You" size="sm" />}
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2 mt-3">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 text-[#fff] rounded-xl"
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** AvatarImage Component for clean reuse */
function AvatarImage({ src, alt, size = "md" }) {
  const sizes = { sm: "w-9 h-9", md: "w-12 h-12" };
  return (
    <div className={`rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center ${sizes[size]}`}>
      <img src={src || "/default-avatar.png"} alt={alt || "User"} className="w-full h-full object-cover" />
    </div>
  );
}
