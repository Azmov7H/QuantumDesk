"use client";

import Link from "next/link";
import MobileSidebars from "@/components/dashboard/profiel-user/MobileSidebarS";
import "../../../../../../globals.css";

export default function SettingsLayout({ children }) {
  const menuItems = [
    { label: "Profile", path: "/dashboard/profile/settings" },
    { label: "Security", path: "/dashboard/profile/settings/security" },
    { label: "Preferences", path: "/dashboard/profile/settings/preferences" },
    { label: "Notifications", path: "/dashboard/profile/settings/notifications" },
  ];

  return (

            <div className="flex min-h-screen bg-[#101a23] text-white">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-[#223649] p-6 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className="block px-4 py-2 rounded-xl hover:bg-[#223649]"
          >
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Sidebar Mobile */}
      <MobileSidebars menuItems={menuItems} />

      {/* Main Content */}
      <main className="flex-1 p-8 mt-3 md:p-8 ">{children}</main>
    </div>

  );
}
