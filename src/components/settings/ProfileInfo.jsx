"use client"
import { useState, useEffect } from "react"
import { getUser, updateUser } from "@/lib/api"

export default function ProfileInfo() {
  const [user, setUser] = useState({ name: "", email: "" })

  useEffect(() => {
    getUser().then(setUser)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateUser(user)
    alert("Profile updated!")
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile Information</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm">Name</label>
          <input
            className="w-full border rounded p-2"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input
            className="w-full border rounded p-2"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </form>
    </div>
  )
}
