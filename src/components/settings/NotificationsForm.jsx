"use client"
import { useState } from "react"
import { updateNotifications } from "@/lib/api"

export default function NotificationsForm() {
  const [emailNotif, setEmailNotif] = useState(true)
  const [appNotif, setAppNotif] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateNotifications({ emailNotif, appNotif })
    alert("Notifications updated!")
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={(e) => setEmailNotif(e.target.checked)}
          />
          <label>Email Notifications</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={appNotif}
            onChange={(e) => setAppNotif(e.target.checked)}
          />
          <label>App Notifications</label>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Settings
        </button>
      </form>
    </div>
  )
}
