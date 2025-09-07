"use client"

export default function ArticleCard({ status, title, description, image }) {
  return (
    <div className="p-4">
      <div className="flex items-stretch justify-between gap-4 rounded-xl">
        <div className="flex flex-col gap-1 flex-[2]">
          <p className="text-[#90adcb] text-sm">{status}</p>
          <p className="text-white text-base font-bold">{title}</p>
          <p className="text-[#90adcb] text-sm">{description}</p>
        </div>
        <div
          className="aspect-video bg-cover rounded-xl flex-1"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
    </div>
  )
}
