"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Comment({ comment, commentUsers }) {
  const userId = typeof comment.user === "string" ? comment.user : comment.user?._id;
  const user = commentUsers[userId] || { username: "Anonymous", profileImage: "/default-avatar.png" };

  return (
    <div className="bg-white/20 p-2 rounded flex items-center gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage src={user.profileImage} />
        <AvatarFallback>{user.username?.slice(0,2).toUpperCase() || "AN"}</AvatarFallback>
      </Avatar>
      <Link href={`/dashboard/users/${userId}`} className="font-bold hover:underline text-blue-300">
        {user.username}
      </Link>
      <span>{comment.content}</span>
    </div>
  );
}
