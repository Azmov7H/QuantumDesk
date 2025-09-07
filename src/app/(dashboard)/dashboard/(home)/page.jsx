export default function DashboardHome() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
        <p className="text-[#c0c5d0]">Here’s what’s happening with your projects today.</p>
      </header>

      {/* Stats */}
      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-[#1a2533] p-6 shadow-md">
          <h2 className="text-lg font-semibold">Posts</h2>
          <p className="text-3xl font-bold">128</p>
        </div>
        <div className="rounded-2xl bg-[#1a2533] p-6 shadow-md">
          <h2 className="text-lg font-semibold">Followers</h2>
          <p className="text-3xl font-bold">3.4k</p>
        </div>
        <div className="rounded-2xl bg-[#1a2533] p-6 shadow-md">
          <h2 className="text-lg font-semibold">Following</h2>
          <p className="text-3xl font-bold">256</p>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
        <ul className="space-y-4">
          <li className="flex items-center space-x-4 rounded-2xl bg-[#1a2533] p-4 shadow">
            <span className="flex-1">You published a new post on Quantum Mechanics</span>
            <span className="text-sm text-[#c0c5d0]">2h ago</span>
          </li>
          <li className="flex items-center space-x-4 rounded-2xl bg-[#1a2533] p-4 shadow">
            <span className="flex-1">New comment on your post from Sarah</span>
            <span className="text-sm text-[#c0c5d0]">4h ago</span>
          </li>
          <li className="flex items-center space-x-4 rounded-2xl bg-[#1a2533] p-4 shadow">
            <span className="flex-1">Michael started following you</span>
            <span className="text-sm text-[#c0c5d0]">6h ago</span>
          </li>
        </ul>
      </section>
    </>
  )
}
