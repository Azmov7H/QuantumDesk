"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/dashboard/home-user/LikeButton";
import { Skeleton } from "@/components/ui/skeleton";

import api from "@/lib/api";
import Image from "next/image";

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComments, setNewComments] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [commentUsers, setCommentUsers] = useState({});
  const [showWelcome, setShowWelcome] = useState(false);

  const router = useRouter();

  // -------------------------------
  // Initialize token & welcome
  // -------------------------------
  useEffect(() => {
    const token = api.token.get();
    if (!token) router.push("/auth/login");

    const welcomeSeen = localStorage.getItem("welcomeSeen");
    if (!welcomeSeen) {
      setShowWelcome(true);
      localStorage.setItem("welcomeSeen", "true");
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [router]);

  // -------------------------------
  // Fetch profile & posts
  // -------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // profile
        const profileRes = await api.auth.getProfile();
        if (!profileRes.ok) return router.push("/auth/login");
        setProfile(profileRes.data);

        // posts
        const postsRes = await api.posts.list();
        if (!postsRes.ok) throw new Error(postsRes.error);
        setPosts(postsRes.data);

        // preload users for comments
        const userIds = [
          ...new Set(
            postsRes.data.flatMap((p) =>
              p.comments?.map((c) =>
                typeof c.user === "string" ? c.user : c.user?._id
              )
            ).filter(Boolean)
          ),
        ];

        await Promise.all(userIds.map((id) => fetchUserById(id)));

        // initialize socket for realtime
        await api.initRealtime();
        api.subscribe("new_comment", ({ postId, comment }) => {
          setPosts((prev) =>
            prev.map((p) =>
              p._id === postId
                ? { ...p, comments: [...(p.comments || []), comment] }
                : p
            )
          );
          const userId = typeof comment.user === "string" ? comment.user : comment.user?._id;
          if (userId && !commentUsers[userId]) fetchUserById(userId);
        });

      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------------------
  // Fetch user by ID (cache)
  // -------------------------------
  const fetchUserById = async (userId) => {
    if (commentUsers[userId]) return commentUsers[userId];
    const res = await api.users.get(userId);
    if (res.ok) {
      setCommentUsers((prev) => ({ ...prev, [userId]: res.data }));
      return res.data;
    } else {
      const unknown = { username: "Unknown", profileImage: "/default-avatar.png" };
      setCommentUsers((prev) => ({ ...prev, [userId]: unknown }));
      return unknown;
    }
  };

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    if (!newComments[postId]) return;

    const content = newComments[postId];
    const tempId = `temp-${Date.now()}`;
    const optimistic = { _id: tempId, content, user: profile };
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: [...(p.comments || []), optimistic] } : p
      )
    );
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
    setCommentsVisible((prev) => ({ ...prev, [postId]: true }));

    // send to API + emit socket
    try {
      await api.addCommentAndEmit(postId, { content });
    } catch (err) {
      console.error(err);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
              ...p,
              comments: p.comments.map((c) =>
                c._id === tempId ? { ...c, error: true } : c
              ),
            }
            : p
        )
      );
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p._id === postId);
      const updatedLikes = [...(post.likes || []), profile._id];
      await api.posts.update(postId, { likes: updatedLikes });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: updatedLikes } : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // -------------------------------
  // Render
  // -------------------------------
  if (loading) {
    return (
      <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-32 w-full mb-2 rounded" />
            <Skeleton className="h-8 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-8">
      {showWelcome && (
        <Card className="bg-purple-700 text-white mb-8 p-6 shadow-lg">
          <CardContent>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to QuantumLeap, {profile?.username ?? "Guest"}!
            </h1>
            <p>Explore the latest scientific posts and updates.</p>
          </CardContent>
        </Card>
      )}

      <header className="mb-8 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.username ?? "Guest"}
        </h1>
        <p className="text-[#c0c5d0]">
          Here’s what’s happening with your projects today.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post._id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-white flex flex-col hover:scale-105 transition-transform duration-300"
          >
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <Image
                width={64}
                height={64}
                src={post.author?.profileImage || "/default-avatar.png"}
                alt={post.author?.username || "Unknown"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link
                href={`/dashboard/users/${post.author?._id}`}
                className="font-bold hover:underline text-blue-300"
              >
                {post.author?.username || "Unknown"}
              </Link>
            </div>

            {/* Post Image */}
            {post.image && (
              <Image
                width={400}
                height={200}
                src={post.image}
                alt={post.title || "Post image"}
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
            )}

            <h2 className="text-xl font-bold mb-2">{post.title || "Untitled"}</h2>
            <p className="text-gray-300 mb-2">{post.summary || "No summary"}</p>
            <p className="text-gray-400 text-sm mb-2">Status: {post.status}</p>

            <LikeButton postId={post._id} initialLikes={post.likes || 0} />

            <Button
              className="mb-2 w-full"
              variant="secondary"
              onClick={() => toggleCommentsVisibility(post._id)}
            >
              {commentsVisible[post._id]
                ? "Hide Comments"
                : `Show Comments (${post.comments?.length || 0})`}
            </Button>

            <Link
              href={`/dashboard/post/${post._id}`}
              className="text-blue-300 hover:underline mb-2"
            >
              Show
            </Link>

            {commentsVisible[post._id] && (
              <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
                {post.comments?.map((c, index) => {
                  const userId = typeof c.user === "string" ? c.user : c.user?._id;
                  const user = commentUsers[userId] || { username: "Unknown", profileImage: "/default-avatar.png" };
                  return (
                    <div
                      key={c._id || index}
                      className={`bg-white/20 p-2 rounded flex items-center gap-2 ${c.error ? "opacity-50 line-through" : ""
                        }`}
                    >
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <Link
                        href={`/dashboard/users/${userId}`}
                        className="font-bold hover:underline text-blue-300"
                      >
                        {user.username}
                      </Link>
                      <span>{c.content}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex mt-2 gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComments[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
              />
              <Button onClick={() => handleAddComment(post._id)}>Comment</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
