"use client";



import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";



export default function PostForm({ editPost, onSuccess, profile }) {
  const [title, setTitle] = useState("");
  const [summary, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /** Populate form if editing */
  useEffect(() => {
    if (!editPost) return;
    setTitle(editPost.title || "");
    setAbstract(editPost.summary || "");
    setContent(editPost.content || "");
    setImage(editPost.image || null);
    setPreview(editPost.image || null);
  }, [editPost]);

  /** Handle image selection */
  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  /** Submit or update post */
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("🟢 handleSubmit triggered");

  if (!title || !summary || !content) {
    return toast.error("All fields are required.");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return toast.error("You must be logged in to publish a post.");
  }

  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    if (image instanceof File) {
      formData.append("image", image);
    }

    console.log("📤 Sending form data to backend...");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // 👇 مهم جدًا: لا تضف Content-Type يدويًا
      },
      body: formData,
    });

    const data = await res.json();
    console.log("📦 Response data:", data);

    if (res.ok) {
      toast.success("✅ Post published successfully!");
      resetForm();
      onSuccess?.(data);
    } else {
      toast.error(`❌ Error: ${data.msg || res.statusText}`);
    }
  } catch (err) {
    console.error("🚨 Submit Error:", err);
    toast.error("🚨 Network or server error!");
  } finally {
    setLoading(false);
  }
};



  /** Delete post */
  const handleDelete = useCallback(async () => {
    if (!editPost) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      await api.posts.delete(editPost._id);
      toast.success("Post deleted!");
      onSuccess?.(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting post");
    } finally {
      setLoading(false);
    }
  }, [editPost, onSuccess]);

  /** Reset form after new post */
  const resetForm = () => {
    setTitle("");
    setAbstract("");
    setContent("");
    setImage(null);
    setPreview(null);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-white flex flex-col md:flex-row gap-8">
      {/* Form Section */}
      <CardContent className="flex-1 flex flex-col gap-4">
        <CardHeader>
          <CardTitle className="text-white">{editPost ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Title */}
          <FormField label="Title" id="title">
            <Input
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormField>

          {/* Abstract */}
          <FormField label="Abstract" id="summary">
            <Textarea
              id="summary"
              placeholder="Short summary..."
              value={summary}
              onChange={(e) => setAbstract(e.target.value)}
              rows={4}
              required
            />
          </FormField>

          {/* Content */}
          <FormField label="Content" id="content">
            <Textarea
              id="content"
              placeholder="Full content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </FormField>

          {/* Actions */}
          <div className="flex gap-4 mt-2 flex-wrap">
            <Button type="submit" disabled={loading} className="bg-[#0A80F5] flex-1 md:flex-none">
              {loading ? (editPost ? "Updating..." : "Submitting...") : editPost ? "Update Post" : "Submit for Review"}
            </Button>

            {editPost && (
              <Button type="button" onClick={handleDelete} disabled={loading} className="bg-red-600 flex-1 md:flex-none">
                {loading ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>

      {/* Image Preview Section */}
      <div className="md:w-1/3 flex flex-col gap-2">
        <Label>Feature Image</Label>
        <input type="file" onChange={handleImageChange} className="text-sm" />
        {preview && (
          <div className="relative w-full h-48 mt-2 border border-zinc-700 rounded-md overflow-hidden">
            <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
        )}
      </div>
    </Card>
  );
}

/** Reusable Form Field */
function FormField({ label, id, children }) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
