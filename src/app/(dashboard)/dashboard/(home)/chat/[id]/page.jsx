"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

let socketInstance = null;

export default function ChatPage() {
  const { id: chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [apiBase, setApiBase] = useState("");
  const [socketUrl, setSocketUrl] = useState("");
  const scrollRef = useRef(null);

  const localUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const base = process.env.NEXT_PUBLIC_URL_API || "";
      setApiBase(base);
      setSocketUrl(base.replace(/\/api\/?$/, ""));
    }
  }, []);

  const safeAvatar = (user) => {
    if (!user) return "/default-avatar.png";
    if (user?.profileImage?.startsWith("http")) return user.profileImage;
    const name = encodeURIComponent(user?.username || "User");
    return `https://ui-avatars.com/api/?name=${name}&background=7c3aed&color=fff`;
  };

  useEffect(() => {
    if (!chatId || !apiBase) return;
    let cancelled = false;
    setLoading(true);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${apiBase}/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled) setMessages(data || []);
        const other = data?.find((m) => m.sender?._id !== localUserId)?.sender;
        if (other) setOtherUser(other);
      } catch (err) {
        console.error(err);
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHistory();
    return () => { cancelled = true; };
  }, [chatId, apiBase]);

  useEffect(() => {
    if (!chatId || !socketUrl || !token) return;
    if (!socketInstance) {
      socketInstance = io(socketUrl, { auth: { token }, transports: ["websocket", "polling"] });
    }
    const socket = socketInstance;

    socket.on("connect", () => {
      setSocketConnected(true);
      if (localUserId) socket.emit("user_connected", localUserId);
      socket.emit("joinChat", chatId);
    });

    socket.on("disconnect", () => setSocketConnected(false));
    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender?._id !== localUserId) setOtherUser(msg.sender);
    });

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newMessage");
    };
  }, [chatId, socketUrl, token, localUserId]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;
    setNewMessage("");

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [...prev, { _id: tempId, sender: { _id: localUserId, username: "You" }, content: text, createdAt: new Date().toISOString(), optimistic: true }]);

    try {
      const res = await fetch(`${apiBase}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ chatId, content: text }),
      });
      const saved = await res.json();
      setMessages((prev) => prev.map((m) => (m._id === tempId ? saved : m)));
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  if (loading) return <div className="p-8 text-white">Loading chat...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1724] p-4">
      <Card className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl shadow-lg flex flex-col">
        <CardHeader className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarImage src={safeAvatar(otherUser)} />
            <AvatarFallback>{otherUser?.username?.[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-white font-semibold">{otherUser?.username || "Conversation"}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 p-2">
          <ScrollArea className="flex-1 overflow-y-auto p-2 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => {
                const isMe = msg.sender?._id === localUserId;
                return (
                  <div key={msg._id || msg.createdAt} className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}>
                    {!isMe && (
                      <Avatar>
                        <AvatarImage src={safeAvatar(msg.sender)} />
                        <AvatarFallback>{msg.sender?.username?.[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-2xl p-3 max-w-[72%] text-sm ${isMe ? "bg-blue-600 text-white" : "bg-zinc-800 text-white"}`}>
                      {!isMe && <div className="text-xs text-zinc-300 mb-1 font-semibold">{msg.sender?.username}</div>}
                      {msg.content}
                      <div className="mt-1 text-[10px] opacity-60 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{msg.optimistic ? " • sending..." : ""}</div>
                    </div>
                    {isMe && <Avatar><AvatarFallback>Y</AvatarFallback></Avatar>}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!socketConnected || !apiBase}
              className="bg-blue-600 text-white"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
