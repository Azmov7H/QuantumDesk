"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiTwotoneLike } from "react-icons/ai";
import api from "@/lib/api";
import { useDashboard } from "@/context/DashboardContext";

export default function LikeButton({ postId, initialLikes = 0 , totle}) {
  const [likes, setLikes] = useState(initialLikes);
  const [optimistic, setOptimistic] = useState(false);
  const { currentUserId } = useDashboard?.() || {};

  // -----------------------------
  // WebSocket subscription
  // -----------------------------
  useEffect(() => {
    let unsub;

    const setup = async () => {
      await api.initRealtime(); // ensure socket is connected
      unsub = api.subscribe("postLiked", ({ postId: pid, likes: newLikes }) => {
        if (pid === postId) {
          setLikes(newLikes);
          setOptimistic(false); // reset optimistic state if WS updates
        }
      });
    };

    setup();

    return () => unsub?.();
  }, [postId]);

  // -----------------------------
  // Handle like click with optimistic UI
  // -----------------------------
  const handleLike = async () => {
    if (optimistic) return; // prevent double click while pending

    setLikes((l) => l + 1); // optimistic increment
    setOptimistic(true);

    try {
      const res = await api.posts.likePost(postId);
      if (!res.ok) {
        // rollback if server rejects
        setLikes((l) => l - 1);
        setOptimistic(false);
        console.error("Like failed:", res.error);
      } else if (currentUserId) {
        // بثّ اختياري لو السيرفر لا يبث
        try { api.emit("postLiked", { postId, likes: likes + 1, by: currentUserId }); } catch {}
      }
    } catch (err) {
      // rollback on network/socket error
      setLikes((l) => l - 1);
      setOptimistic(false);
      console.error("Like error:", err);
    }
  };
  

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className="flex items-center gap-1"
      disabled={optimistic}
    >
      <AiTwotoneLike />
      Like {totle ? `(${totle})` : likes > 0 ? `(${likes})` : ""}
    </Button>
  );
}
