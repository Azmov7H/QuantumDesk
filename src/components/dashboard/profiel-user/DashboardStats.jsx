export default function DashboardStats({ stats }) {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#314d68]"
        >
          <p className="text-white text-base font-medium">{s.label}</p>
          <p className="text-white text-2xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  )
}
