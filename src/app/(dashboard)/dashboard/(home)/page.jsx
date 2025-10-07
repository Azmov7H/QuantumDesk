"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PostCard from "@/components/dashboard/home-user/PostCard";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";



export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentUsers, setCommentUsers] = useState({});
  const [showWelcome, setShowWelcome] = useState(false);

  // ---------------- Profile + Welcome ----------------
  useEffect(() => {
    const init = async () => {
      const token = api.token.get();
      if (!token) setProfile({ username: "Anonymous", _id: "guest" });
      else {
        try {
          const res = await api.auth.getProfile();
          setProfile(res.ok ? res.data : { username: "Anonymous", _id: "guest" });
        } catch {
          setProfile({ username: "Anonymous", _id: "guest" });
        }
      }

      if (!localStorage.getItem("welcomeSeen")) {
        setShowWelcome(true);
        localStorage.setItem("welcomeSeen", "true");
        setTimeout(() => setShowWelcome(false), 5000);
      }
    };
    init();
  }, []);

  // ---------------- Fetch Posts + Realtime ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postsRes = await api.posts.list();
        if (!postsRes.ok) throw new Error(postsRes.error);
        setPosts(postsRes.data);

        // Cache comment users
        const userIds = [
          ...new Set(
            postsRes.data.flatMap((p) =>
              p.comments?.map((c) =>
                typeof c.user === "string" ? c.user : c.user?._id
              )
            ).filter(Boolean)
          ),
        ];

        const usersData = {};
        await Promise.all(userIds.map(async id => {
          const res = await api.users.get(id);
          usersData[id] = res.ok ? res.data : { username: "Unknown", profileImage: "/default-avatar.png" };
        }));
        setCommentUsers(usersData);

        // Realtime subscription
        await api.initRealtime();
        api.subscribe("new_comment", ({ postId, comment }) => {
          setPosts(prev =>
            prev.map(p =>
              p._id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p
            )
          );

          const userId = typeof comment.user === "string" ? comment.user : comment.user?._id;
          if (userId && !usersData[userId]) fetchUserById(userId);
        });

      } catch (err) {
        console.error(err);
        setError("⚠️ Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserById = async (userId) => {
      if (commentUsers[userId]) return commentUsers[userId];
      const res = await api.users.get(userId);
      const data = res.ok ? res.data : { username: "Unknown", profileImage: "/default-avatar.png" };
      setCommentUsers(prev => ({ ...prev, [userId]: data }));
      return data;
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-32 w-full mb-2" />
        <Skeleton className="h-8 w-1/2" />
      </Card>
    ))}
  </div>;

  if (error) return (
    <div className="p-8">
      <Alert variant="destructive" title="Error">{error}</Alert>
      <div className="mt-4">
        <Button onClick={async () => {
          setError("");
          setLoading(true);
          try {
            const postsRes = await api.posts.list();
            if (!postsRes.ok) throw new Error(postsRes.error);
            setPosts(postsRes.data);
          } catch (e) {
            setError("⚠️ Something went wrong. Please try again later.");
          } finally {
            setLoading(false);
          }
        }}>Retry</Button>
      </div>
    </div>
  );

  return (
      <div className="p-8">
        {showWelcome && profile && (
          <Card className="bg-purple-700 text-white mb-8 p-6 shadow-lg">
            <CardContent>
              <h1 className="text-3xl font-bold mb-2">Welcome to QuantumLeap, {profile.username}!</h1>
              <p>Explore the latest scientific posts and updates.</p>
            </CardContent>
          </Card>
        )}

        <header className="mb-8 text-white">
          <h1 className="text-3xl font-bold">Welcome back, {profile?.username ?? "Guest"}</h1>
          <p className="text-[#c0c5d0]">Here’s what’s happening with your projects today.</p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post._id} post={post} profile={profile} commentUsers={commentUsers} setCommentUsers={setCommentUsers} />
          ))}
        </div>
      </div>
  );
}
