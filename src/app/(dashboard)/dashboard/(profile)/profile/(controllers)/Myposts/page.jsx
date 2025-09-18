"use client"

import { useState, useEffect } from "react"

export default function MyPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/posts`,
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error("Failed to fetch posts")
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        console.error(err)
        setPosts([]) // fallback to empty array
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#101a23] overflow-x-hidden"
      style={{ fontFamily: 'Newsreader, "Noto Sans", sans-serif' }}
    >
      <div className="flex flex-col max-w-[960px] mx-auto w-full flex-1 py-6">
        {/* Title + CTA */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-white text-[32px] font-bold leading-tight">
            My Posts
          </p>
          <button className="rounded-xl h-8 px-4 bg-[#223649] text-white text-sm font-medium">
            + New Post
          </button>
        </div>

        {/* Filters, Tags, Search, Sort, View Switch */}
        {/* ... خليهم زي ما هما في الكود اللي انت عاملهم ... */}

        {/* Posts */}
        {loading ? (
          <p className="text-white p-4">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-white p-4">No posts available</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="p-4">
              <div className="flex flex-col @xl:flex-row bg-[#223649] rounded-xl overflow-hidden">
                {post.image && (
                  <div
                    className="w-full aspect-video bg-cover bg-center rounded-xl @xl:rounded-none"
                    style={{ backgroundImage: `url(${post.image})` }}
                  ></div>
                )}
                <div className="flex flex-col flex-1 justify-center gap-2 py-4 px-4">
                  <p className="text-white text-lg font-bold">{post.title}</p>
                  <p className="text-[#8fadcc] text-base">{post.summary}</p>
                  <p className="text-[#8fadcc] text-base">
                    Status: {post.status}
                  </p>
                  <div className="flex justify-end">
                    <button className="rounded-xl h-8 px-4 bg-[#0b80f4] text-white text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
