"use client";

// DashboardLayout.js
import DesktopSidebar from "@/components/dashboard/profiel-user/DesktopSidebar";
import MobileSidebar from "@/components/dashboard/profiel-user/MobileSidebar";
import "../../../../../globals.css";

export default function ProfileLayout({ children }) {
  return (

        <div className="flex min-h-screen bg-[#101a23] ">
          {/* Sidebar للـ Desktop */}
          <aside className="hidden md:flex md:w-64 border-r border-[#223649]">
            <DesktopSidebar />
          </aside>

          {/* Drawer للهاتف */}
          <MobileSidebar  />

          {/* المحتوى الرئيسي */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>

  );
}
