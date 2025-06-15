// app/(dashboard)/dashboard/posts/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Posts</h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post._id} className="p-4 border rounded bg-card">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
