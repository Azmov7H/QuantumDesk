"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CommentList from "./CommentList"
import AddCommentForm from "./AddCommentForm"
import Image from "next/image"

export default function PostCard({
  post,
  commentsVisible,
  toggleCommentsVisibility,
  handleLike,
  handleCommentChange,
  handleAddComment,
  newComments,
  commentUsers,
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-white flex flex-col hover:scale-105 transition-transform duration-300">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={post.author?.profileImage || "/default-avatar.png"}
          alt={post.author?.username || "Unknown"}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <Link href={`/users/${post.author?._id}`} className="font-bold hover:underline text-blue-300">
          {post.author?.username || "Unknown"}
        </Link>
      </div>

      {/* Post Image */}
      {post.image && (
        <Image src={post.image} width={100} height={100} alt={post.title || "Post image"} className="rounded-lg mb-4 w-full h-48 object-cover" />
      )}

      {/* Title & Summary */}
      <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
      <p className="text-gray-300 mb-2">{post.summary || "No summary"}</p>
      <p className="text-gray-400 text-sm mb-2">Status: {post.status}</p>

      {/* Likes */}
      <Button className="mb-2 w-full" onClick={() => handleLike(post._id)}>
        👍 Like ({post.likes?.length || 0})
      </Button>

      {/* Toggle Comments */}
      <Button className="mb-2 w-full" variant="secondary" onClick={() => toggleCommentsVisibility(post._id)}>
        {commentsVisible[post._id] ? "Hide Comments" : `Show Comments (${post.comments?.length || 0})`}
      </Button>

      {/* Comments */}
      {commentsVisible[post._id] && <CommentList comments={post.comments} commentUsers={commentUsers} />}

      {/* Add Comment */}
      <AddCommentForm
        value={newComments[post._id] || ""}
        onChange={(val) => handleCommentChange(post._id, val)}
        onSubmit={() => handleAddComment(post._id)}
      />
    </div>
  )
}
