"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiTwotoneLike } from "react-icons/ai";

const API_BASE = process.env.NEXT_PUBLIC_URL_API

export default function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    try {
      await fetch(`${API_BASE}/posts/${postId}/like`, { method: "POST" });
      setLikes((prev) => prev + 1);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <Button onClick={handleLike}>
      <AiTwotoneLike/> Like {likes > 0 && <span className="ml-1">({likes})</span>}
    </Button>
  );
}
