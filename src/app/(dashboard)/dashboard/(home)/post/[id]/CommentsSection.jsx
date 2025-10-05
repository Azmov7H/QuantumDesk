"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";

/* ──────────────── 💬 Comments Section ──────────────── */
export default function CommentsSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ──────────────── 1️⃣ تحميل التعليقات والاشتراك في السوكت ──────────────── */
  useEffect(() => {
    const fetchComments = async () => {
      const res = await api.comments.list(postId);
      if (res.ok) setComments(res.data);
      else console.error("❌ فشل تحميل التعليقات:", res.error);
    };

    fetchComments();

    // الاشتراك في التعليقات الجديدة من خلال socket.io
    const unsubscribe = api.subscribe("new_comment", (payload) => {
      if (payload.postId === postId) {
        setComments((prev) => [payload.comment, ...prev]);
      }
    });

    return () => unsubscribe();
  }, [postId]);

  /* ──────────────── 2️⃣ إرسال تعليق جديد ──────────────── */
  const handleAddComment = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);

    // تحديث متفائل (قبل تأكيد السيرفر)
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      _id: tempId,
      content: text,
      user: currentUser,
      createdAt: new Date(),
      pending: true,
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setText("");

    // إرسال إلى API
    const res = await api.addCommentAndEmit(postId, { text });

    if (res.ok) {
      // استبدال المؤقت بالرد الحقيقي من السيرفر
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? res.data : c))
      );
    } else {
      // وضع حالة فشل على التعليق المؤقت
      setComments((prev) =>
        prev.map((c) =>
          c._id === tempId ? { ...c, pending: false, error: res.error } : c
        )
      );
      console.error("❌ فشل إرسال التعليق:", res.error);
    }

    setLoading(false);
  };

  /* ──────────────── 3️⃣ واجهة العرض ──────────────── */
  return (
    <div className="space-y-4 border-t border-[#223649] pt-6">
      {/* 📝 صندوق الإدخال */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="اكتب تعليقك..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-[#223649] text-white border-none focus:ring-2 focus:ring-[#3b82f6]"
        />
        <Button
          onClick={handleAddComment}
          disabled={loading}
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
        >
          {loading ? "..." : "إرسال"}
        </Button>
      </div>

      {/* 💬 قائمة التعليقات */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">لا توجد تعليقات بعد.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className={`flex items-start gap-3 ${
                c.pending ? "opacity-70" : ""
              }`}
            >
              <Avatar className="border border-[#223649]">
                <AvatarImage src={c.user?.profileImage || ""} />
                <AvatarFallback>
                  {c.user?.username?.slice(0, 1).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col bg-[#15202b] p-3 rounded-xl w-full">
                <span className="text-sm font-semibold text-[#90adcb]">
                  {c.user?.username || "مستخدم"}
                </span>
                <p className="text-sm text-white leading-snug break-words">
                  {c.content}
                </p>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(c.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {c.pending && " (جاري الإرسال...)"}
                  {c.error && " (فشل الإرسال)"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
