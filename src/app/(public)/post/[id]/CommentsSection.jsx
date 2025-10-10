"use client";

import { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"; // لو بتستخدم sonner للتنبيهات
import api from "@/lib/api";
import Link from "next/link";

export default function CommentsSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ──────────────── تحميل التعليقات ──────────────── */
  useEffect(() => {
    const fetchComments = async () => {
      const res = await api.comments.list(postId);
      if (res.ok) setComments(res.data);
      else console.error("❌ فشل تحميل التعليقات:", res.error);
    };

    fetchComments();

    // الاشتراك في التعليقات الجديدة من socket.io
    const unsubscribe = api.subscribe("new_comment", (payload) => {
      if (payload.postId === postId) {
        setComments((prev) => [payload.comment, ...prev]);
      }
    });

    return () => unsubscribe();
  }, [postId]);

  /* ──────────────── إرسال تعليق ──────────────── */
  const handleAddComment = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);

    // تعليق مؤقت
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
      // استبدال التعليق المؤقت بالحقيقي
      setComments((prev) =>
        prev.map((c) => (c._id === tempId ? res.data : c))
      );
    } else {
      // فشل الإرسال
      setComments((prev) =>
        prev.map((c) =>
          c._id === tempId ? { ...c, pending: false, error: res.error } : c
        )
      );
      console.error("❌ فشل إرسال التعليق:", res.error);

      // ✅ تصحيح الشرط — لأن الخطأ الحقيقي بيكون "Unauthorized"
      if (res.error?.toLowerCase() === "unauthorized") {
        toast.error("⚠️ You must be logged in to comment.");
        localStorage.removeItem("token"); // حذف التوكن الحالي
        const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.assign(`/auth/login?redirect=${redirectTo}`);
      }
    }

    setLoading(false);
  };



  /* ──────────────── واجهة العرض ──────────────── */
  return (
    <Suspense fallback={<Skeleton className="space-y-4 border-t border-[#223649] pt-6" />}>
      <div className="space-y-4 border-t border-[#223649] pt-6">
        {/* 📝 إدخال تعليق */}
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

          {/* 🔒 زر تسجيل الخروج */}
          {currentUser && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#223649] text-gray-300 hover:bg-[#223649]"
            >
              تسجيل خروج
            </Button>
          )}
        </div>

        {/* 💬 التعليقات */}
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
                  <Link
                    href={`/dashboard/users/${c.user?._id}`}
                    className="text-sm font-semibold text-[#90adcb]"
                  >
                    {c.user?.username || "مستخدم"}
                  </Link>
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
    </Suspense>
  );
}
