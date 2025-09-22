"use client";

import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div className="p-6 min-h-screen bg-[#0f1724]">
      <h1 className="text-2xl font-bold mb-4 text-white">Create a New Post</h1>
      <PostForm
        onSuccess={(data) => console.log("Post saved:", data)}
      />
    </div>
  );
}
