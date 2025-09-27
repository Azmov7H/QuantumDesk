// components/sidebar.js
"use client";

import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <nav className="space-y-2">
        <Link href="/dashboard" className="block font-semibold">
          🧪 المنشورات
        </Link>
        <Link href="/dashboard/comments" className="block font-semibold">
          💬 التعليقات
        </Link>
        <Link href="/dashboard/moderation" className="block font-semibold">
          ✅ الإشراف
        </Link>
        {/* ... أضف باقي الروابط حسب الحاجة */}
      </nav>
    </aside>
  );
}
