"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PostForm({ editPost, onSuccess }) {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState("");

  /** Set API base on mount */
  useEffect(() => {
    if (typeof window === "undefined") return;
    setApi(process.env.NEXT_PUBLIC_BASE_URL);
  }, []);

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
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!api) return;
      setLoading(true);

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) throw new Error("You must login first");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("summary", abstract);
        formData.append("content", content);
        if (image instanceof File) formData.append("image", image);

        const url = editPost ? `${api}/api/posts/${editPost._id}` : `${api}/api/posts`;
        const res = await fetch(url, {
          method: editPost ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.msg || "Failed to submit post");
        }

        const data = await res.json();
        toast.success(editPost ? "Post updated!" : "Post created!");
        onSuccess?.(data);

        if (!editPost) resetForm();
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Error submitting post");
      } finally {
        setLoading(false);
      }
    },
    [title, abstract, content, image, editPost, api, onSuccess]
  );

  /** Delete post */
  const handleDelete = useCallback(async () => {
    if (!editPost || !api) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${api}/api/posts/${editPost._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || "Failed to delete post");
      }

      toast.success("Post deleted!");
      onSuccess?.(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting post");
    } finally {
      setLoading(false);
    }
  }, [editPost, api, onSuccess]);

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
          <FormField label="Abstract" id="abstract">
            <Textarea
              id="abstract"
              placeholder="Short summary..."
              value={abstract}
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
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md mt-2 border border-zinc-700" />
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
