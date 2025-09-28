"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CommentInput({ post, token, commentUsers, setCommentUsers }) {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = async () => {
    if (!commentText) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/posts/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });
      const comment = await res.json();

      post.comments.push(comment); // update locally
      setCommentText("");

      const userId = typeof comment.user === "string" ? comment.user : comment.user?._id;
      if (userId && !commentUsers[userId]) {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.ok ? await userRes.json() : { _id: userId, username: "Unknown", profileImage: "/default-avatar.png" };
        setCommentUsers(prev => ({ ...prev, [userId]: userData }));
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex mt-2 gap-2">
      <Input placeholder="Add a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
      <Button onClick={handleAddComment}>Comment</Button>
    </div>
  );
}
