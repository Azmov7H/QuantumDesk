"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // أو استخدم shadcn toast لو مضاف
import api from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    try {
      api.token.clear(); // 🧹 مسح التوكن
      toast.success("You have been logged out successfully"); // ✅ إشعار
      setTimeout(() => router.push("/dashboard"), 1000); // 🔁 توجيه بعد ثانية
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed, please try again");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="w-full sm:w-auto cursor-pointer"
    >
      Log Out
    </Button>
  );
}
