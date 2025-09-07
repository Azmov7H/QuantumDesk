"use client"

const filters = ["Status", "Category", "Tags"]

export default function FilterBar() {
  return (
    <div className="flex gap-3 p-3 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter}
          className="flex h-8 items-center gap-2 rounded-xl bg-[#223649] px-4 text-white text-sm"
        >
          {filter} ⬇️
        </button>
      ))}
    </div>
  )
}
