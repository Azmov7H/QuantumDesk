"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, FileText, Plus, MessageCircle, User, Settings } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function MobileSidebar() {
  const menuItems = [
    { label: "Home", icon: Home, path: "/dashboard/profile" },
    { label: "My Posts", icon: FileText, path: "/dashboard/profile/Myposts" },
   // { label: "New Post", icon: Plus, path: "/dashboard/profile/newposts" },
   // { label: "Chat", icon: MessageCircle, path: "/dashboard/profile/chat" },
    { label: "Profile", icon: User, path: "/dashboard/profile" },
    { label: "Settings", icon: Settings, path: "/dashboard/profile/settings" },
  ];

  return (
    <Sheet >
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden fixed top-2 left-2 z-50">
          <Menu className="w-8 h-8 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 bg-[#101a23] p-6 fixed top-0 left-0 h-full shadow-xl">
        <SheetTitle>
          <VisuallyHidden>Menu</VisuallyHidden>
        </SheetTitle>

        <div className="flex flex-col gap-4 mt-6">
          {menuItems.map((item) => (
            <SheetClose key={item.label} asChild>
              <Link
                href={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#223649] text-white"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
