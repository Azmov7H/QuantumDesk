"use client";

import { useState } from "react";
import Image from "next/image";
import CommentInput from "./CommentInput";
import api from "@/lib/api";

export default function CommentsSection({ post, profile, commentUsers, setCommentUsers }) {
  const [newComments, setNewComments] = useState({});

  const handleCommentChange = (value) => setNewComments({ content: value });
  const handleAddComment = async () => {
    if (!profile || profile._id === "guest") return alert("Login required to comment.");
    if (!newComments.content) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = { _id: tempId, content: newComments.content, user: profile };

    post.comments = [...(post.comments || []), optimistic];
    setNewComments({ content: "" });

    try {
      const res = await api.addCommentAndEmit(post._id, { text: optimistic.content });
      if (!res.ok) optimistic.error = true;
    } catch {
      optimistic.error = true;
    }
  };

  return (
    <div className="flex flex-col w-max gap-2 mt-2 max-h-64 overflow-y-auto">
      {post.comments?.map((c, i) => {
        const userId = typeof c.user === "string" ? c.user : c.user?._id;
        const user = commentUsers[userId] || { username: "Unknown", profileImage: "/default-avatar.png" };
        return (
          <div key={c._id || i} className={`bg-white/20 p-2 rounded flex items-center gap-2 ${c.error ? "opacity-50 line-through" : ""}`}>
            <div className="relative w-6 h-6">
              <Image src={user.profileImage || "/default-avatar.png"} alt={user.username} fill sizes="24px" className="rounded-full object-cover" />
            </div>
            <span className="font-bold">{user.username}</span>
            <span>{c.content}</span>
          </div>
        );
      })}
      <CommentInput value={newComments.content || ""} onChange={handleCommentChange} onSubmit={handleAddComment} />
    </div>
  );
}
