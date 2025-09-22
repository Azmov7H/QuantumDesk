export default function UserHeader({ username }) {
  return (
    <header className="mb-8 text-white">
      <h1 className="text-3xl font-bold">Welcome back, {username ?? "Guest"}</h1>
      <p className="text-[#c0c5d0]">Here’s what’s happening with your projects today.</p>
    </header>
  )
}
