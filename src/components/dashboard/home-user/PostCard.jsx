"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import LikeButton from "./LikeButton";
import CommentsSection from "./CommentsSection";

export default function PostCard({ post, profile, commentUsers, setCommentUsers }) {
  const [commentsVisible, setCommentsVisible] = useState(false);

  return (
    <Card className="w-full md:ml-[5%] bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg text-white flex flex-col  transition-transform duration-300">
      <div className="flex items-center gap-3 mb-2">
        <Image
          width={64} height={64}
          src={post.author?.profileImage || "/default-avatar.png"}
          alt={post.author?.username || "Unknown"}
          className="rounded-full object-cover"
        />
        <span className="font-bold">{post.author?.username || "Unknown"}</span>
      </div>

      {post.image && (
        <Image
          width={800} height={800}
          src={post.image}
          alt={post.title || "Post image"}
          className="rounded-lg mb-4 w-full h-74 object-cover"
        />
      )}

      <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
      <p className="text-gray-300 mb-2">{post.summary || "No summary"}</p>
      <div className="flex gap-3 items-center justify-between">
        <Button className="mb-2 w-max" variant="secondary" onClick={() => setCommentsVisible(prev => !prev)}>
          {commentsVisible ? "Hide Comments" : `Show Comments (${post.comments?.length || 0})`}
        </Button>
        <LikeButton postId={post._id} />


      </div>

      {commentsVisible && (
        <CommentsSection post={post} profile={profile} commentUsers={commentUsers} setCommentUsers={setCommentUsers} />
      )}
      <Link href={`/dashboard/post/${post._id}`}>
        <Button className={'w-max '} variant={'ghost'}>Show</Button>
      </Link>
    </Card>
  );
}
