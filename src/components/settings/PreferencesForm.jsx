"use client"
import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

export default function PreferencesForm() {
  const [lang, setLang] = useState("en")
  const [theme, setTheme] = useState("light")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await api.auth.update({ lang, theme })
    if (res.ok) alert("Preferences saved!")
    else alert(res.error || "Failed to save preferences")
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preferences</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm">Language</label>
          <select
            className="w-full border rounded p-2"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Theme</label>
          <select
            className="w-full border rounded p-2"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <Button type="submit" variant="default">
          Save Preferences
        </Button>
      </form>
    </div>
  )
}
