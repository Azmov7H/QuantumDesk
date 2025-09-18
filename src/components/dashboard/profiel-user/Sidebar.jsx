import {
  Home,
  FileText,
  Plus,
  MessageCircle,
  User,
  Settings,
} from "lucide-react"
import Link from "next/link"


export default function Sidebar() {
  const menuItems = [
    { label: "Home", icon: Home, active: true ,path:"/dashboard/profile"},
    { label: "My Posts", icon: FileText ,path:"/dashboard/profile/Myposts"},
    { label: "New Post", icon: Plus ,path:"/dashboard/profile/newposts"},
    { label: "Chat", icon: MessageCircle,path:"/dashboard/profile/chat" },
    { label: "Profile", icon: User ,path:"dashboard/profile"},
  ]

  return (
    <div className="flex flex-col w-80 min-h-[700px] justify-between bg-[#101a23] p-4">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link href={item.path}
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
              item.active ? "bg-[#223649]" : ""
            }`}
          >
            <item.icon className="w-5 h-5 text-white" />
            <p className="text-white text-sm font-medium">{item.label}</p>
          </Link>
        ))}
      </div>


      <div className="flex items-center gap-3 px-3 py-2">
        <Link  className="flex items-center gap-3 px-3 py-2" href={"/dashboard/profile/settings"}>
             <Settings className="w-5 h-5 text-white" />
        <p className="text-white text-sm font-medium">Settings</p></Link>
   
      </div>
    </div>
  )
}
