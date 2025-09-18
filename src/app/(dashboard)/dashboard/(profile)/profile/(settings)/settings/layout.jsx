import "../../../../../../globals.css"
export default function SettingsLayout({ children }) {
  return (
    <html>
        <body>
                <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 border-r p-4">
        <nav className="space-y-4">
          <a href="/dashboard/profile/settings" className="block hover:text-blue-600">Profile</a>
          <a href="/dashboard/profile/settings/security" className="block hover:text-blue-600">Security</a>
          <a href="/dashboard/profile/settings/preferences" className="block hover:text-blue-600">Preferences</a>
          <a href="/dashboard/profile/settings/notifications" className="block hover:text-blue-600">Notifications</a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">{children}</main>
    </div>
        </body>
    </html>
  )
}
