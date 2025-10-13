"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AiTwotoneLike } from "react-icons/ai";
import api from "@/lib/api";
import { useDashboard } from "@/context/DashboardContext";

export default function LikeButton({ postId}) {
  const [likes, setLikes] = useState(0);
  const [optimistic, setOptimistic] = useState(false);
  const { currentUserId } = useDashboard?.() || {};
  const [totleLikes, setTotleLikes] = useState(0);

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
    gettotle();

    return () => unsub?.();
  }, [postId]);

  // -----------------------------
  // Handle like click with optimistic UI
  // -----------------------------
const handleLike = async () => {
  try {
    const res = await api.like.toggle(postId);
    if (res.ok) {
      setTotleLikes((prev) => prev + 1);
      setOptimistic(true);
    } else {
      console.error("Failed to toggle like:", res.error);
    }
  } catch (err) {
    console.error("Failed to toggle like:", err);
  }
};

const gettotle = async () => {
  try {
    const res = await api.like.getLikes(postId);

    if (res.ok) {
      setTotleLikes(res.data || 0);
    } else {
      console.error("Failed to fetch likes:", res.error);
    }
  } catch (err) {
    console.error("Failed to fetch likes:", err);
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
      Like {totleLikes}
    </Button>
  );
}
