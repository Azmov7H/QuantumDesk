"use client"
import { useState } from "react"
import { updatePreferences } from "@/lib/api"
import { ThemeContext } from "@/context/ThemeContext"

export default function PreferencesForm() {
  const [lang, setLang] = useState("en")
  const {theme, setTheme} = useContext(ThemeContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updatePreferences({ lang, theme })
    alert("Preferences saved!")
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

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Preferences
        </button>
      </form>
    </div>
  )
}
