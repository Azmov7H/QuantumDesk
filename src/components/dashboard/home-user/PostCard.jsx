"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

export default function PostCard({ post, token, commentUsers, setCommentUsers }) {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [postsState, setPostsState] = useState(post);

  const handleLike = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/posts/${post._id}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedLikes = await res.json();
      setPostsState(prev => ({ ...prev, likes: updatedLikes }));
    } catch (err) { console.error(err); }
  };

  const toggleCommentsVisibility = () => setCommentsVisible(prev => !prev);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-white flex flex-col hover:scale-105 transition-transform duration-300">
      
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          <AvatarImage src={post.author?.profileImage || "/default-avatar.png"} />
          <AvatarFallback>{post.author?.username?.slice(0,2).toUpperCase() || "NA"}</AvatarFallback>
        </Avatar>
        <Link href={`/dashboard/users/${post.author?._id}`} className="font-bold hover:underline text-blue-300">
          {post.author?.username || "Unknown"}
        </Link>
      </div>

      {/* Image */}
      {post.image && <img src={post.image} alt={post.title} className="rounded-lg mb-4 w-full h-48 object-cover" />}

      {/* Title & Summary */}
      <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
      <p className="text-gray-300 mb-2">{post.summary || "No summary"}</p>

      {/* Likes */}
      <Button className="mb-2 w-full" onClick={handleLike}>
        👍 Like ({postsState.likes?.length || 0})
      </Button>

      {/* Toggle Comments */}
      <Button className="mb-2 w-full" variant="secondary" onClick={toggleCommentsVisibility}>
        {commentsVisible ? "Hide Comments" : `Show Comments (${postsState.comments?.length || 0})`}
      </Button>

      {/* Comments */}
      {commentsVisible && (
        <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
          {postsState.comments?.map((c, i) => (
            <Comment key={c._id || i} comment={c} commentUsers={commentUsers} />
          ))}
        </div>
      )}

      {/* Add Comment */}
      <CommentInput post={postsState} token={token} commentUsers={commentUsers} setCommentUsers={setCommentUsers} />
    </div>
  );
}
