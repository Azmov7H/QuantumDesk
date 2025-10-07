"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";

export default function PostCard({ post, profile, commentUsers, setCommentUsers }) {
  const [commentsVisible, setCommentsVisible] = useState(false);

  return (
    <Card className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-white flex flex-col hover:scale-105 transition-transform duration-300">
      <div className="flex items-center gap-3 mb-4">
        <Image
          width={40} height={40}
          src={post.author?.profileImage || "/default-avatar.png"}
          alt={post.author?.username || "Unknown"}
          className="rounded-full object-cover"
        />
        <span className="font-bold">{post.author?.username || "Unknown"}</span>
      </div>

      {post.image && (
        <Image
          width={400} height={200}
          src={post.image}
          alt={post.title || "Post image"}
          className="rounded-lg mb-4 w-full h-48 object-cover"
        />
      )}

      <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
      <p className="text-gray-300 mb-2">{post.summary || "No summary"}</p>

      <LikeButton postId={post._id} initialLikes={post.likes || 0} />

      <Button className="mb-2 w-full" variant="secondary" onClick={() => setCommentsVisible(prev => !prev)}>
        {commentsVisible ? "Hide Comments" : `Show Comments (${post.comments?.length || 0})`}
      </Button>

      {commentsVisible && (
        <CommentsSection post={post} profile={profile} commentUsers={commentUsers} setCommentUsers={setCommentUsers} />
      )}
    </Card>
  );
}
