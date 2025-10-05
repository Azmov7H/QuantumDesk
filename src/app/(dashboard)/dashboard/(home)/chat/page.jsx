'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ChatListPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ---------------------------
  // Fetch chats + Realtime init
  // ---------------------------
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.chats.list();
        if (res.ok) setChats(Array.isArray(res.data) ? res.data : []);
        else setChats([]);
      } catch (err) {
        console.error("❌ Fetch chats error:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Init socket for realtime updates
    api.initRealtime().then(() => {
      const unsub = api.subscribe("newMessage", (msg) => {
        setChats((prev) => {
          const idx = prev.findIndex((c) => c._id === msg.chatId);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx].lastMessage = msg.text;
            return updated;
          }
          return prev;
        });
      });
      return () => unsub();
    });
  }, []);

  // ---------------------------
  // Filter chats based on search
  // ---------------------------
  const filteredChats = chats.filter((chat) =>
    chat.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-4 text-white">Loading chats...</div>;

  return (
    <div className="flex h-[90vh] w-full p-4">
      <Card className="w-full rounded-2xl shadow-md flex flex-col">
        <CardHeader>
          <CardTitle>Chats</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full p-0">
          <div className="p-2">
            <Input
              placeholder="Search..."
              className="rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ScrollArea className="flex-1 p-2">
            {filteredChats.length === 0 ? (
              <div className="text-center text-muted-foreground mt-10">No chats found</div>
            ) : (
              filteredChats.map((chat) => (
                <Button
                  key={chat._id}
                  variant="ghost"
                  className="flex items-center gap-3 justify-start rounded-none mb-3 p-4"
                  onClick={() => router.push(`/dashboard/chat/${chat._id}`)}
                >
                  <Avatar>
                    <AvatarImage src={chat.user?.profileImage || "/default-avatar.png"} />
                    <AvatarFallback>
                      {chat.user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{chat.user?.username}</span>
                    <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                      {chat.lastMessage || "No messages yet"}
                    </span>
                  </div>
                </Button>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
