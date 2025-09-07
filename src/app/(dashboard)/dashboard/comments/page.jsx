// app/(dashboard)/dashboard/comments/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function MyComments() {
  const [comments, setComments] = useState([]);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/comments`) // You may need to secure it by userId
      .then((res) => res.json())
      .then((data) => setComments(data.filter((c) => c.user === userId)));
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Comments</h2>
      <ul className="space-y-2">
        {comments.map((comment) => (
          <li key={comment._id} className="border p-3 rounded bg-card">
            <p>{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
