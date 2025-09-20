"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function UserProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    fetch(`${process.env.NEXT_PUBLIC_URL_API}/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found")
        return res.json()
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
  }, [id])

  if (error) return <div className="text-red-500">{error}</div>
  if (!user) return <div className="text-gray-400">Loading...</div>

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white/10 p-6 rounded-xl shadow">
      <img
        src={user.profileImage || "/default-avatar.png"}
        alt={user.username}
        className="w-24 h-24 rounded-full object-cover mx-auto"
      />
      <h1 className="text-2xl font-bold text-center mt-4">{user.username}</h1>
      <p className="text-center text-gray-400">{user.email}</p>
      <p className="text-sm text-center text-gray-500 mt-2">
        Joined: {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  )
}
