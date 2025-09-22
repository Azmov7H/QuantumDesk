"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PostForm({ editPost, onSuccess }) {
  const [title, setTitle] = useState(editPost?.title ?? "");
  const [abstract, setAbstract] = useState(editPost?.summary ?? "");
  const [content, setContent] = useState(editPost?.content ?? "");
  const [image, setImage] = useState(editPost?.image ?? null);
  const [preview, setPreview] = useState(editPost?.image ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title ?? "");
      setAbstract(editPost.summary ?? "");
      setContent(editPost.content ?? "");
      setImage(editPost.image ?? null);
      setPreview(editPost.image ?? null);
    }
  }, [editPost]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must login first");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("summary", abstract);
      formData.append("content", content);
      if (image instanceof File) formData.append("image", image);

      const url = editPost
        ? `${process.env.NEXT_PUBLIC_URL_API}/posts/${editPost._id}`
        : `${process.env.NEXT_PUBLIC_URL_API}/posts`;
      const method = editPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg ?? "Failed to submit post");
      }

      const data = await res.json();
      toast.success(editPost ? "Post updated!" : "Post created!");
      onSuccess?.(data);

      if (!editPost) {
        setTitle("");
        setAbstract("");
        setContent("");
        setImage(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message ?? "Error submitting post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editPost) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/posts/${editPost._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg ?? "Failed to delete post");
      }

      toast.success("Post deleted!");
      onSuccess?.(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message ?? "Error deleting post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md rounded-lg p-6 text-white flex flex-col md:flex-row gap-8">
      <CardContent className="flex-1 flex flex-col gap-4">
        <CardHeader>
          <CardTitle className="text-white">
            {editPost ? "Edit Post" : "Create New Post"}
          </CardTitle>
        </CardHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea
              id="abstract"
              placeholder="Short summary..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Full content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#0A80F5] w-full md:w-auto"
            >
              {loading
                ? editPost
                  ? "Updating..."
                  : "Submitting..."
                : editPost
                ? "Update Post"
                : "Submit for Review"}
            </Button>

            {editPost && (
              <Button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 w-full md:w-auto"
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <div className="md:w-1/3 flex flex-col gap-2">
        <Label>Feature Image</Label>
        <input type="file" onChange={handleImageChange} className="text-sm" />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md mt-2"
          />
        )}
      </div>
    </Card>
  );
}
