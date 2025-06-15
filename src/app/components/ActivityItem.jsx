import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquareText, Pencil, UserPlus } from "lucide-react"

export default function ActivityItem({ activity }) {
  const icons = {
    post: Pencil,
    comment: MessageSquareText,
    follow: UserPlus,
  }

  const Icon = icons[activity.type]

  return (
    <div className="flex items-center gap-4">
      {activity.avatar ? (
        <Avatar>
          <AvatarImage src={activity.avatar} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      ) : (
        <div className="bg-[#1f2d3d] p-2 rounded-md">
          <Icon className="text-white w-5 h-5" />
        </div>
      )}
      <div>
        <p className="text-sm font-medium">{activity.title}</p>
        <p className="text-xs text-gray-400">{activity.subtitle}</p>
      </div>
    </div>
  )
}
