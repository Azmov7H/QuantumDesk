import DashboardHeader from "@/components/dashboard/profiel-user/DashboardHeader"
import DashboardStats from "@/components/dashboard/profiel-user/DashboardStats"
import RecentActivity from "@/components/dashboard/profiel-user/RecentActivity"

export default function DashboardPage() {
  const stats = [
    { label: "Posts", value: 12 },
    { label: "Followers", value: 250 },
    { label: "Following", value: 150 },
  ]

  return (
    <div className="flex flex-col flex-1 bg-[#101a23]">
      <DashboardHeader user="Alex" />
      <DashboardStats stats={stats} />
      <RecentActivity />
    </div>
  )
}
