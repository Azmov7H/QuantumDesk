"use client"
import { useState } from "react"
import { updatePassword } from "@/lib/api"

export default function SecurityForm() {
  const [oldPass, setOldPass] = useState("")
  const [newPass, setNewPass] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updatePassword(oldPass, newPass)
    alert("Password updated!")
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
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Update Password
        </button>
      </form>
    </div>
  )
}
