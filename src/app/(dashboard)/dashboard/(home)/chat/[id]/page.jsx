"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * ملاحظات مهمة قبل التشغيل:
 * - ضع في .env: NEXT_PUBLIC_URL_API=https://.../api   (مثال: https://be-quantumleap-production.up.railway.app/api)
 * - تأكد أن localStorage يحتوي: token (JWT) و userId (id للحالي)
 * - Socket URL سيتم اشتقاقه من NEXT_PUBLIC_URL_API عن طريق إزالة /api
 */

let socketInstance = null;

export default function ChatPage() {
  const { id: chatId } = useParams(); // chatId من URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [otherUser, setOtherUser] = useState(null); // بيانات الطرف الآخر (username, profileImage, _id)
  const scrollRef = useRef(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const localUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const API_BASE = process.env.NEXT_PUBLIC_URL_API; // مثال: https://.../api
  const SOCKET_URL = API_BASE ? API_BASE.replace(/\/api\/?$/, "") : null; // https://...

  // ---------- helpers ----------
  const safeAvatar = (user) => {
    // رجّع رابط صالح أو رابط افتراضي
    if (!user) return "/default-avatar.png";
    if (user.profileImage && typeof user.profileImage === "string" && user.profileImage.startsWith("http")) {
      return user.profileImage;
    }
    const name = encodeURIComponent(user.username || "User");
    return `https://ui-avatars.com/api/?name=${name}&background=7c3aed&color=fff`;
  };

  // ---------- fetch history (GET) ----------
  useEffect(() => {
    if (!chatId || !API_BASE) return;
    let cancelled = false;
    setLoading(true);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/messages/${chatId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("Failed to load messages:", res.status, text);
          setMessages([]);
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        // data expected: array of messages populated with sender { _id, username, profileImage }
        setMessages(Array.isArray(data) ? data : []);

        // حاول نحدد الطرف الآخر (أول رسالة غير مرسلة من نفس المستخدم)
        if (Array.isArray(data) && data.length > 0) {
          const other = data.find((m) => m.sender && m.sender._id !== localUserId)?.sender;
          if (other) setOtherUser(other);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, API_BASE]);

  // ---------- socket setup ----------
  useEffect(() => {
    if (!chatId || !SOCKET_URL) return;

    // create single global socket instance if not exists
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
        // path: "/socket.io" // default, change only if your server uses different path
      });
    }

    const socket = socketInstance;

    const onConnect = () => {
      console.log("Socket connected:", socket.id);
      setSocketConnected(true);
      // register presence on server (server stores map userId -> socketId)
      if (localUserId) socket.emit("user_connected", localUserId);
      // join room for this chat
      socket.emit("joinChat", chatId);
    };

    const onDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      setSocketConnected(false);
    };

    // handle incoming newMessage (from server-side emit)
    const onNewMessage = (msg) => {
      // msg should be populated (sender has username/profileImage)
      // avoid duplicates if same _id exists
      setMessages((prev) => {
        if (msg._id && prev.some((m) => m._id === msg._id)) return prev;
        // remove matching optimistic temp (by content + createdAt? better by temp id check below)
        // If server returns message equal to optimistic one, we replace by message with same content but has _id
        const hasTempIndex = prev.findIndex((m) => m.optimistic && m.content === msg.content);
        if (hasTempIndex !== -1) {
          const newArr = [...prev];
          newArr[hasTempIndex] = msg;
          return newArr;
        }
        return [...prev, msg];
      });

      // update otherUser info if sender is the other
      if (msg.sender && msg.sender._id && msg.sender._id !== localUserId) {
        setOtherUser(msg.sender);
      }
    };

    const onConnectError = (err) => {
      console.error("Socket connect_error:", err);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("newMessage", onNewMessage);
    socket.on("connect_error", onConnectError);

    return () => {
      // leave room and remove listeners (keep global socket for reuse)
      if (socket && socket.connected) {
        try {
          socket.emit("leaveChat", chatId);
        } catch (e) {}
      }
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("newMessage", onNewMessage);
      socket.off("connect_error", onConnectError);
      // NOTE: we do not socket.disconnect() here to allow reuse across pages.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, SOCKET_URL, token, localUserId]);

  // ---------- auto scroll ----------
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------- send message (POST then rely on server emit to other user) ----------
  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;
    if (!API_BASE) {
      console.error("API_BASE not defined");
      return;
    }

    // optimistic temp message
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      chat: chatId,
      sender: { _id: localUserId, username: "You", profileImage: null },
      content: text,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId, content: text }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Failed to send message:", res.status, errText);
        // remove temp message
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
        return;
      }

      const saved = await res.json(); // saved message object with _id and populated sender? controller returns message (maybe not populated)
      // if saved.message doesn't have populated sender, at least saved.sender === req.user.id; attach username if localUser known
      // Replace temp message with saved
      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? saved : m))
      );

      // Note: server (POST handler) should be emitting 'newMessage' to other users; recipient will receive it via socket.
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  // ---------- UI ----------
  if (loading) return <div className="p-8 text-white">Loading chat...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1724] p-4">
      <Card className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl shadow-lg">
        <CardContent className="flex flex-col h-[80vh] p-4">
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center"
                style={{ flexShrink: 0 }}
              >
                <img
                  src={safeAvatar(otherUser)}
                  alt={otherUser?.username || "User"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div className="text-white font-semibold">
                  {otherUser?.username || "Conversation"}
                </div>
                <div className="text-xs text-zinc-300">
                  {/* إذا أردت حالة أونلاين/أوفلاين يجب أن يبعث السيرفر event مثل user_online */}
                  {socketConnected ? (
                    <span className="text-emerald-400">Connected</span>
                  ) : (
                    <span className="text-yellow-300">Connecting...</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-sm text-zinc-300">{/* خيارات */}</div>
          </div>

          {/* messages area */}
          <ScrollArea className="flex-1 overflow-y-auto p-2 bg-[rgba(255,255,255,0.02)] rounded-lg">
            <div className="flex flex-col gap-3 py-2">
              {messages.map((msg) => {
                const sender = msg.sender || {};
                const isMe =
                  sender._id && localUserId && sender._id.toString() === localUserId.toString();
                return (
                  <div
                    key={msg._id || msg.createdAt}
                    className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {/* left avatar for other */}
                    {!isMe && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-zinc-600">
                        <img
                          src={safeAvatar(sender)}
                          alt={sender.username || "User"}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}

                    {/* bubble */}
                    <div
                      className={`rounded-2xl p-3 max-w-[72%] text-sm ${isMe ? "bg-blue-600 text-white" : "bg-zinc-800 text-white"}`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {!isMe && <div className="text-xs text-zinc-300 mb-1 font-semibold">{sender.username || "Unknown"}</div>}
                      <div>{msg.content}</div>
                      <div className="mt-1 text-[10px] opacity-60 text-right">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        {msg.optimistic ? " • sending..." : ""}
                      </div>
                    </div>

                    {/* right avatar for me */}
                    {isMe && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-blue-700">
                        <img
                          src={safeAvatar({ username: "You", profileImage: null })}
                          alt="You"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* input */}
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
            />
            <Button onClick={sendMessage} disabled={!socketConnected && !API_BASE}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
