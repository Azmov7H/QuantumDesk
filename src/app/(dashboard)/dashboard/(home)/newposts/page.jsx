"use client";

import PostForm from "@/components/PostForm";
import { useRouter } from "next/navigation";
import { useCallback } from "react";


export default function NewPostPage() {
  const router = useRouter();
  const handleSuccess = useCallback((res) => {
    // Redirect to home after successful creation
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="p-6 min-h-screen bg-[#0f1724]">
      <h1 className="text-2xl font-bold mb-4 text-white">Create a New Post</h1>
      <PostForm onSuccess={handleSuccess} />
    </div>
  );
}
