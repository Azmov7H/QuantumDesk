"use client";

// DesktopSidebar.js
import Link from "next/link";
import { Home, FileText, Plus, MessageCircle, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DesktopSidebar() {

    const router = useRouter();
  
  
    function logout(){
      localStorage.removeItem("token");
      router.push("/")
  
    }
  const menuItems = [
    { label: "Home", icon: Home, path: "/dashboard/profile" },
    { label: "My Posts", icon: FileText, path: "/dashboard/profile/Myposts" },
   // { label: "New Post", icon: Plus, path: "/dashboard/profile/newposts" },
   // { label: "Chat", icon: MessageCircle, path: "/dashboard/profile/chat" },
    { label: "Profile", icon: User, path: "/dashboard/profile" },
    { label: "Settings", icon: Settings, path: "/dashboard/profile/settings" },
        { href: "/", icon: User, path: "Log out" },

  ];

  return (
    <div className="flex flex-col justify-between bg-[#101a23] p-4 min-h-full relative">
      <div className="flex flex-col gap-2 ">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#223649] text-white"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
          
        ))}
               <Link key="Logout" href= "/" className="text-white absolute left-5 bottom-6 text-2xl"  onClick = {()=>{logout()}} >Log out</Link>
        
      </div>
    </div>
  );
}
