import { FileText, MessageCircle } from "lucide-react"
import ActivityItem from "./ActivityItem"

export default function RecentActivity() {
  const activities = [
    {
      icon: FileText,
      title: "Exploring the Quantum Realm",
      subtitle: "Published a new post",
    },
    {
      icon: MessageCircle,
      title: "Comment on 'Exploring the Quantum Realm'",
      subtitle: "Received a new comment",
    },
    {
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuByfy_PDjMjWEHXud69E0DFgMl8in4uIpqP-JTuhfcnnjWF8M8UGThvHLj5ucXEU9LPPRncXZuai7pz4yVkrfdmSVpmn9f2qEklYGg5nga11URsiTMDu_vS386Iftj-Dg7G5hH42YCKFDNi3L3wDrpFxWocPwIkpu5Fll5z099T7qWs2sgSKI_LiUtmYfwrVFDn6Bu2WYXqAup98cyXnW075niZFEolzAExTWsXLkKNf5P-XVtWJ7urpXtOJ3sSHkAYPDYs0UOamF4I",
      title: "Sarah Miller started following you",
      subtitle: "Gained a new follower",
    },
  ]

  return (
    <div className="px-4 pb-6">
      <h2 className="text-white text-[22px] font-bold pt-5 pb-3">
        Recent Activity
      </h2>
      <div className="flex flex-col gap-2">
        {activities.map((a, i) => (
          <ActivityItem key={i} {...a} />
        ))}
      </div>
    </div>
  )
}
