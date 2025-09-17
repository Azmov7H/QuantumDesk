"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function PostForm({ editPost, onSuccess }) {
  const [title, setTitle] = useState(editPost?.title || "");
  const [abstract, setAbstract] = useState(editPost?.summary || "");
  const [review, setReview] = useState(editPost?.content || "");
  const [image, setImage] = useState(editPost?.image || null);
  const [preview, setPreview] = useState(editPost?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || "");
      setAbstract(editPost.summary || "");
      setReview(editPost.content || "");
      setImage(editPost.image || null);
      setPreview(editPost.image || null);
    }
  }, [editPost]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
      formData.append("content", review);
      if (image && image instanceof File) formData.append("image", image);

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
        throw new Error(errData.msg || "Failed to submit post");
      }

      const data = await res.json();
      toast.success(editPost ? "Post updated!" : "Post created!");
      if (onSuccess) onSuccess(data);

      if (!editPost) {
        setTitle("");
        setAbstract("");
        setReview("");
        setImage(null);
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error submitting post");
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
        throw new Error(errData.msg || "Failed to delete post");
      }

      toast.success("Post deleted!");
      if (onSuccess) onSuccess(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error deleting post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-8 p-6 text-white"
    >
      <div className="flex-1">
        <label className="block mb-2">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="w-full mb-6"
          required
        />

        <label className="block mb-2">Abstract</label>
        <textarea
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          rows={4}
          placeholder="Short summary..."
          className="w-full mb-6 rounded-md p-3 resize-none"
          required
        />

        <label className="block mb-2">Content</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={8}
          placeholder="Full content..."
          className="w-full mb-6 rounded-md p-3 resize-none"
          required
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#0A80F5] w-full md:w-auto"
          >
            {loading
              ? "Submitting..."
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

      <div className="md:w-1/3">
        <label className="block mb-2">Feature Image</label>
        <input type="file" onChange={handleImageChange} className="mb-2" />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md"
          />
        )}
      </div>
    </form>
  );
}
