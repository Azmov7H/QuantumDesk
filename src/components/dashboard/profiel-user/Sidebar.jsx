import {
  Home,
  FileText,
  Plus,
  MessageCircle,
  User,
  Settings,
} from "lucide-react"

export default function Sidebar() {
  const menuItems = [
    { label: "Home", icon: Home, active: true },
    { label: "My Posts", icon: FileText },
    { label: "New Post", icon: Plus },
    { label: "Chat", icon: MessageCircle },
    { label: "Profile", icon: User },
  ]

  return (
    <div className="flex flex-col w-80 min-h-[700px] justify-between bg-[#101a23] p-4">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
              item.active ? "bg-[#223649]" : ""
            }`}
          >
            <item.icon className="w-5 h-5 text-white" />
            <p className="text-white text-sm font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 px-3 py-2">
        <Settings className="w-5 h-5 text-white" />
        <p className="text-white text-sm font-medium">Settings</p>
      </div>
    </div>
  )
}
