"use client"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function ProfileInfo() {
  const [user, setUser] = useState({ name: "", email: "" })

  useEffect(() => {
    (async () => {
      const res = await api.auth.getProfile()
      if (res.ok) setUser({ name: res.data.username || "", email: res.data.email || "" })
    })()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.users.updateMe({ username: user.name, email: user.email })
    if (res.ok) alert("Profile updated!")
    else alert(res.error || "Failed to update profile")
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

        <Button type="submit">Save Changes</Button>

      </form>
    </div>
  )
}
