import Link from "next/link"
import Image from "next/image"

export default function CommentList({ comments, commentUsers }) {
  return (
    <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
      {comments?.map((c, index) => {
        const userId = typeof c.user === "string" ? c.user : c.user?._id
        const user = commentUsers[userId] || { username: "Unknown", profileImage: "/default-avatar.png" }

        return (
          <div key={c._id || index} className="bg-white/20 p-2 rounded flex items-center gap-2">
            <Image src={user.profileImage || "/default-avatar.png"} alt={user.username} width={24} height={24} className="rounded-full object-cover" />
            <Link href={`/dashboard/users/${userId}`} className="font-bold hover:underline text-blue-300">
              {user.username}
            </Link>
            <span>{c.content}</span>
          </div>
        )
      })}
    </div>
  )
}
