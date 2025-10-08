"use client"
import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function SecurityForm() {
  const [oldPass, setOldPass] = useState("")
  const [newPass, setNewPass] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.auth.update({ oldPassword: oldPass, password: newPass })
    if (res.ok) alert("Password updated!")
    else alert(res.error || "Failed to update password")
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Security Settings</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm">Current Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">New Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
        </div>
        <Button type="submit">Update Password</Button>
      </form>
    </div>
  )
}
