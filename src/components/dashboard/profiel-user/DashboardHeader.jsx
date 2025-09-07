export default function DashboardHeader({ user = "Alex" }) {
  return (
    <div className="flex flex-wrap justify-between gap-3 p-4">
      <p className="text-white text-[32px] font-bold">Welcome back, {user}</p>
    </div>
  )
}
