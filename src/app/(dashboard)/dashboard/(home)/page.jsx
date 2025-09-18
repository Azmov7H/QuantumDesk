"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComments, setNewComments] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // جلب بيانات المستخدم
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          router.push("/auth/login");
          return null;
        }
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setError("Something went wrong, please try again later.");
      });

    // جلب البوستات
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // الترحيب لمرة واحدة
    const welcomeSeen = localStorage.getItem("welcomeSeen");
    if (!welcomeSeen) {
      setShowWelcome(true);
      localStorage.setItem("welcomeSeen", "true");
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [router, token]);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const handleCommentChange = (postId, value) => {
    setNewComments({ ...newComments, [postId]: value });
  };

  const handleAddComment = async (postId) => {
    if (!newComments[postId]) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComments[postId] }),
      });
      const comment = await res.json();
      // تحديث البوست بالتعليق الجديد
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p));
      setNewComments({ ...newComments, [postId]: "" });
      setCommentsVisible({ ...commentsVisible, [postId]: true }); // تظهر التعليقات تلقائياً
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/posts/${postId}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedLikes = await res.json();
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: updatedLikes } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible({ ...commentsVisible, [postId]: !commentsVisible[postId] });
  };

  return (
    <div className="p-8">
      {showWelcome && (
        <div className="bg-purple-700 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to QuantumLeap, {profile?.username ?? "Guest"}!
          </h1>
          <p>Explore the latest scientific posts and updates.</p>
        </div>
      )}

      {!showWelcome && (
        <header className="mb-8 text-white">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.username ?? "Guest"}
          </h1>
          <p className="text-[#c0c5d0]">
            Here’s what’s happening with your projects today.
          </p>
        </header>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <div key={post._id} className="bg-[#362447] rounded-lg p-4 shadow-lg text-white flex flex-col">
            
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={post.author?.profileImage || "/default-avatar.png"}
                alt={post.author?.username || "Unknown"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-bold">{post.author?.username || "Unknown"}</span>
            </div>

            {/* Post Image */}
            {post.image && <img src={post.image} alt={post.title || "Post image"} className="rounded-lg mb-4 w-full h-48 object-cover" />}

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
            {commentsVisible[post._id] && (
              <div className="flex flex-col gap-2 mt-2">
                {post.comments?.map((c, index) => (
                  <div key={c._id || index} className="bg-[#4b3b63] p-2 rounded flex items-center gap-2">
                    <img
                      src={c.user?.profileImage || "/default-avatar.png"}
                      alt={c.user?.username || "Unknown"}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-bold">{c.user?.username || "Unknown"}:</span>
                    <span>{c.content}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex mt-2 gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComments[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
              />
              <Button onClick={() => handleAddComment(post._id)}>Comment</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
