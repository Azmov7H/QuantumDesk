"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import Image from "next/image";

export default function ChatPage() {
  const { id: chatId } = useParams();
  const router = useRouter();

  const [me, setMe] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const scrollRef = useRef(null);

  // -------------------------
  // Load current user
  // -------------------------
  useEffect(() => {
    (async () => {
      if (!api.token.exists()) {
        router.push("/auth/login");
        return;
      }
      const res = await api.auth.getProfile();
      if (res.ok) setMe(res.data);
    })();
  }, [router]);

  // -------------------------
  // Fetch chat history
  // -------------------------
  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    const res = await api.messages.list(chatId);
    if (res.ok) {
      setMessages(res.data || []);
      const other = res.data.find(m => m.sender && m.sender._id !== me?._id)?.sender;
      if (other) setOtherUser(other);
    } else {
      console.error("Failed to fetch messages:", res.error);
      setMessages([]);
    }
    setLoading(false);
  }, [chatId, me]);

  useEffect(() => {
    if (me) fetchMessages();
  }, [fetchMessages, me]);

  // -------------------------
  // Initialize Realtime Socket
  // -------------------------
  useEffect(() => {
    if (!chatId || !me) return;

    api.initRealtime().then(socket => {
      if (!socket) return;

      setSocketConnected(socket.connected);

      const unsubConnect = api.subscribe("connect", () => setSocketConnected(true));
      const unsubDisconnect = api.subscribe("disconnect", () => setSocketConnected(false));

      const unsubError = api.subscribe("connect_error", (err) => {
        console.error("Socket error:", err);
        setSocketConnected(false);
      });

      const unsubNewMsg = api.subscribe("newMessage", msg => {
        if (msg.chatId !== chatId) return;
        setMessages(prev =>
          prev.some(m => m._id === msg._id) ? prev : [...prev, msg]
        );
        if (msg.sender && msg.sender._id !== me?._id) setOtherUser(msg.sender);
      });

      // Join chat room
      api.emit("joinChat", chatId);

      return () => {
        api.emit("leaveChat", chatId);
        unsubConnect();
        unsubDisconnect();
        unsubNewMsg();
        unsubError();
      };
    });
  }, [chatId, me]);

  // -------------------------
  // Scroll to bottom
  // -------------------------
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------
  // Send message
  // -------------------------
  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      chat: chatId,
      sender: {
        _id: me?._id,
        username: me?.username || "You",
        profileImage: me?.profileImage,
      },
      content: text,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");

    const res = await api.messages.send(chatId, { content: text });
    if (res.ok) {
      setMessages(prev =>
        prev.map(m => (m._id === tempId ? res.data : m))
      );
    } else {
      console.error("Failed to send message:", res.error);
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
              <Avatar src={otherUser?.profileImage} />
              <div>
                <div className="text-white font-semibold">
                  {otherUser?.username || "Conversation"}
                </div>
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
                const isMe = sender._id === me?._id;
                return (
                  <div
                    key={msg._id || msg.createdAt}
                    className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && <Avatar src={sender.profileImage} />}
                    <div
                      className={`rounded-2xl p-3 max-w-[72%] text-sm ${isMe ? "bg-blue-600 text-white" : "bg-zinc-800 text-white"}`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {!isMe && (
                        <div className="text-xs text-zinc-300 mb-1 font-semibold">
                          {sender.username}
                        </div>
                      )}
                      <div>{msg.content}</div>
                      <div className="mt-1 text-[10px] opacity-60 text-right">
                        {msg.createdAt &&
                          new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        {msg.optimistic && " • sending..."}
                      </div>
                    </div>
                    {isMe && <Avatar src={me?.profileImage || "/default-avatar.png"} />}
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
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/** Avatar Component */
function Avatar({ src }) {
  return (
    <div className="rounded-full overflow-hidden bg-zinc-700 w-12 h-12 flex items-center justify-center">
      <Image
        width={64}
        height={64}
        src={src || "/default-avatar.png"}
        alt="User"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
