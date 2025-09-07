export default function ActivityItem({ icon: Icon, title, subtitle, avatar }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 min-h-[72px] bg-[#101a23]">
      {avatar ? (
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14"
          style={{ backgroundImage: `url(${avatar})` }}
        />
      ) : (
        <div className="flex items-center justify-center rounded-lg bg-[#223649] text-white size-12">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      )}

      <div className="flex flex-col">
        <p className="text-white text-base font-medium line-clamp-1">{title}</p>
        <p className="text-[#90adcb] text-sm">{subtitle}</p>
      </div>
    </div>
  )
}
