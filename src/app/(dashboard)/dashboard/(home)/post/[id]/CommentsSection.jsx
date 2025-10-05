"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";

export default function CommentsSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // 1️⃣ Load initial comments + subscribe to new comments
  useEffect(() => {
    const fetchComments = async () => {
      const res = await api.comments.list(postId);
      if (res.ok) setComments(res.data);
      else console.error("❌ Fetch comments failed", res.error);
    };

    fetchComments();

    // subscribe to new comments via socket
    const unsub = api.subscribe("new_comment", (payload) => {
      if (payload.postId === postId) {
        setComments((prev) => [payload.comment, ...prev]);
      }
    });

    return () => unsub();
  }, [postId]);

  // 2️⃣ Add comment
  const handleAddComment = async () => {
    if (!text.trim()) return;
    setLoading(true);

    // optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      content: text,
      user: currentUser,
      createdAt: new Date(),
      pending: true,
    };
    setComments((prev) => [optimistic, ...prev]);
    setText("");

    const res = await api.addCommentAndEmit(postId, { text });

    if (res.ok) {
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? res.data : c))
      );
    } else {
      // mark as failed
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? { ...c, pending: false, error: res.error } : c))
      );
      console.error("❌ Comment failed", res.error);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleAddComment} disabled={loading}>
          {loading ? "..." : "Send"}
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c._id || `comment-${Date.now()}-${Math.random()}`} className={`flex items-start gap-3 ${c.pending ? "opacity-70" : ""}`}>
            <Avatar>
              <AvatarImage src={c.user?.profileImage || ""} />
              <AvatarFallback>{c.user?.username?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-white ">
              <span className="text-sm font-medium">{c.user?.username || "Unknown"}</span>
              <p className="text-sm">{c.content}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(c.createdAt).toLocaleTimeString()}
                {c.pending && " (sending...)"}
                {c.error && " (failed)"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
