"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function MobileSidebars({ menuItems }) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed top-2 left-4 z-50">
            <Menu className="w-8 h-8 text-white" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 bg-[#101a23] p-6 h-full shadow-xl">
          <SheetTitle>
            <VisuallyHidden>Menu</VisuallyHidden>
          </SheetTitle>

          <div className="flex flex-col gap-4 mt-6">
            {menuItems.map((item) => (
              <SheetClose key={item.label} asChild>
                <Link
                  href={item.path}
                  className="block px-4 py-2 rounded-xl text-white hover:bg-[#223649]"
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
