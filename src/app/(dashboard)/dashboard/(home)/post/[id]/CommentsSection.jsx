"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const API_BASE = process.env.NEXT_PUBLIC_URL_API

export default function CommentsSection({ postId, initialComments }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });
      const data = await res.json();
      setComments((prev) => [data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  return (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Comments</h2>

        {/* إضافة تعليق */}
        <form onSubmit={handleComment} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button type="submit">Post</Button>
        </form>

        {/* عرض التعليقات */}
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-500">No comments yet.</p>
          )}
          {comments.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={c.user?.profileImage} />
                <AvatarFallback>
                  {c.user?.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{c.user?.username}</p>
                <p className="text-sm text-gray-700">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
