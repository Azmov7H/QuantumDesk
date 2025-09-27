"use client"
export const dynamic = "force-dynamic"


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link"

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComments, setNewComments] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [commentUsers, setCommentUsers] = useState({}); // { userId: userData }
  const [token, setToken] = useState(null);

  const router = useRouter();

  // Initialize token
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/auth/login");
    } else {
      setToken(t);
    }

    // Welcome banner
    const welcomeSeen = localStorage.getItem("welcomeSeen");
    if (!welcomeSeen) {
      setShowWelcome(true);
      localStorage.setItem("welcomeSeen", "true");
      setTimeout(() => setShowWelcome(false), 5000);
    }
  }, [router]);

  // Fetch profile and posts
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [profileRes, postsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_URL_API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_URL_API}/posts`, { cache: "no-store" }),
        ]);

        if (!profileRes.ok) {
          localStorage.removeItem("token");
          router.push("/auth/login");
          return;
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        const postsData = await postsRes.json();
        setPosts(postsData);

        // Preload users for all comments
        const userIds = [
          ...new Set(
            postsData.flatMap((p) =>
              p.comments?.map((c) =>
                typeof c.user === "string" ? c.user : c.user?._id
              )
            ).filter(Boolean)
          ),
        ];
        await Promise.all(userIds.map((id) => fetchUserById(id)));
      } catch (err) {
        console.error(err);
        setError("Something went wrong, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

  // Fetch user by ID
  const fetchUserById = async (userId) => {
    if (commentUsers[userId]) return commentUsers[userId];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const user = await res.json();
      setCommentUsers((prev) => ({ ...prev, [userId]: user }));
      return user;
    } catch (err) {
      console.error(err);
      return { username: "Unknown", profileImage: "/default-avatar.png" };
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
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

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p
        )
      );

      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      setCommentsVisible((prev) => ({ ...prev, [postId]: true }));

      const userId = typeof comment.user === "string" ? comment.user : comment.user?._id;
      if (userId && !commentUsers[userId]) {
        fetchUserById(userId);
      }
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
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p._id === postId ? { ...p, likes: updatedLikes } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setCommentsVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-white flex flex-col hover:scale-105 transition-transform duration-300"
          >
            {/* Author Info */}

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={post.author?.profileImage || "/default-avatar.png"}
                alt={post.author?.username || "Unknown"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <Link
                href={`/users/${post.author?._id}`}
                className="font-bold hover:underline text-blue-300"
              >
                {post.author?.username || "Unknown"}
              </Link>
            </div>
            {/* Post Image */}
            {post.image && (
              <img
                src={post.image}
                alt={post.title || "Post image"}
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
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
            <Button
              className="mb-2 w-full"
              variant="secondary"
              onClick={() => toggleCommentsVisibility(post._id)}
            >
              {commentsVisible[post._id]
                ? "Hide Comments"
                : `Show Comments (${post.comments?.length || 0})`}
            </Button>

            {/* Comments */}
            {commentsVisible[post._id] && (
              <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">

                {post.comments?.map((c, index) => {
                  // نجيب ال id سواء كان string أو object
                  const userId = typeof c.user === "string" ? c.user : c.user?._id;

                  // نجيب بيانات اليوزر من الكاش لو موجود
                  const user = commentUsers[userId] || { username: "Unknown", profileImage: "/default-avatar.png" };

                  return (
                    <div key={c._id || index} className="bg-white/20 p-2 rounded flex items-center gap-2">
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
