"use client"
import Navbar from "@/components/dashboard/home-user/NavBar"
import FilterBar from "@/components/dashboard/home-user/FilterBar"
import ArticlesList from "@/components/dashboard/home-user/ArticlesList"
import "../../../globals.css"

export default function DashboardLayout() {
  return (
    <html>
      <body>
            <div className="flex flex-col min-h-screen bg-[#101a23]">
      <Navbar />
      <main className="px-40 flex flex-1 flex-col py-5">
        <div className="flex justify-between p-4">
          <p className="text-white text-[32px] font-bold">My Articles</p>
        </div>
        <FilterBar />
        <ArticlesList />
      </main>
    </div>
      </body>
    </html>
  )
}
