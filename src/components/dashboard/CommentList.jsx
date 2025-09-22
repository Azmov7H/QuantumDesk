import Link from "next/link"

export default function CommentList({ comments, commentUsers }) {
  return (
    <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
      {comments?.map((c, index) => {
        const userId = typeof c.user === "string" ? c.user : c.user?._id
        const user = commentUsers[userId] || { username: "Unknown", profileImage: "/default-avatar.png" }

        return (
          <div key={c._id || index} className="bg-white/20 p-2 rounded flex items-center gap-2">
            <img src={user.profileImage} alt={user.username} className="w-6 h-6 rounded-full object-cover" />
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
