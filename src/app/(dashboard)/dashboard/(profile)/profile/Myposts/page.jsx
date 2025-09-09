"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const samplePosts = [
  {
    id: 1,
    title: "Exploring the Quantum Realm: A Deep Dive into Entanglement",
    desc: "This post delves into the fascinating phenomenon of quantum entanglement, exploring its theoretical foundations, experimental evidence, and potential applications.",
    status: "Published",
    tags: ["Physics", "Quantum Mechanics"],
    meta: "Published on Jan 15, 2024 · 12 min read",
    img: "https://source.unsplash.com/800x400/?quantum,physics",
  },
  {
    id: 2,
    title: "The Riemann Hypothesis: Unraveling the Mystery of Prime Numbers",
    desc: "An in-depth exploration of the Riemann Hypothesis, one of the most significant unsolved problems in mathematics and its implications for prime number distribution.",
    status: "Draft",
    tags: ["Mathematics", "Number Theory"],
    meta: "Last edited on Feb 29, 2024 · 15 min read",
    img: "https://source.unsplash.com/800x400/?math,numbers",
  },
  {
    id: 3,
    title: "The Future of AI: Ethical Considerations and Societal Impact",
    desc: "This post discusses the ethical implications of artificial intelligence, examining its potential impact on society, employment, and human autonomy.",
    status: "Pending Review",
    tags: ["Computer Science", "Ethics"],
    meta: "Submitted on Mar 10, 2024 · 8 min read",
    img: "https://source.unsplash.com/800x400/?ai,ethics",
  },
]

export default function MyPosts() {
  const [posts] = useState(samplePosts)

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
          <Button className="rounded-xl h-8 px-4 bg-[#223649] text-white text-sm font-medium">
            + New Post
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 p-3 flex-wrap pr-4">
          <button className="flex h-8 items-center gap-2 rounded-xl bg-[#223649] pl-4 pr-2 text-white text-sm font-medium">
            Status
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
        </div>

        {/* Tags */}
        <div className="flex gap-3 p-3 flex-wrap pr-4">
          {["All Tags", "Physics", "Mathematics"].map((tag) => (
            <div
              key={tag}
              className="flex h-8 items-center justify-center gap-2 rounded-xl bg-[#223649] px-4 text-white text-sm font-medium"
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <label className="flex w-full h-12">
            <div className="flex w-full items-center rounded-xl bg-[#223649]">
              <div className="text-[#8fadcc] pl-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
              </div>
              <input
                placeholder="Search"
                className="w-full flex-1 rounded-r-xl bg-[#223649] px-4 text-white placeholder:text-[#8fadcc] focus:outline-none"
              />
            </div>
          </label>
        </div>

        {/* Sort */}
        <div className="flex gap-3 p-3 flex-wrap pr-4">
          <button className="flex h-8 items-center gap-2 rounded-xl bg-[#223649] pl-4 pr-2 text-white text-sm font-medium">
            Sort by
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
            </svg>
          </button>
        </div>

        {/* View Switch */}
        <div className="flex border-b border-[#304d69] px-4 gap-8 pb-3">
          <a className="flex flex-col items-center border-b-[3px] border-b-[#0b80f4] text-white gap-1 pb-2.5 pt-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M216,56v60a4,4,0,0,1-4,4H136V44a4,4,0,0,1,4-4h60A16,16,0,0,1,216,56ZM116,40H56A16,16,0,0,0,40,56v60a4,4,0,0,0,4,4h76V44A4,4,0,0,0,116,40Zm96,96H136v76a4,4,0,0,0,4,4h60a16,16,0,0,0,16-16V140A4,4,0,0,0,212,136ZM40,140v60a16,16,0,0,0,16,16h60a4,4,0,0,0,4-4V136H44A4,4,0,0,0,40,140Z"></path>
            </svg>
            <p className="text-sm font-bold">Grid</p>
          </a>
          <a className="flex flex-col items-center text-[#8fadcc] gap-1 pb-2.5 pt-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
            </svg>
            <p className="text-sm font-bold">List</p>
          </a>
        </div>

        {/* Posts */}
        {posts.map((post) => (
          <div key={post.id} className="p-4">
            <div className="flex flex-col @xl:flex-row bg-[#223649] rounded-xl overflow-hidden">
              <div
                className="w-full aspect-video bg-cover bg-center rounded-xl @xl:rounded-none"
                style={{ backgroundImage: `url(${post.img})` }}
              ></div>
              <div className="flex flex-col flex-1 justify-center gap-2 py-4 px-4">
                <p className="text-white text-lg font-bold">{post.title}</p>
                <p className="text-[#8fadcc] text-base">{post.desc}</p>
                <p className="text-[#8fadcc] text-base">
                  Status: {post.status} · {post.tags.join(", ")} · {post.meta}
                </p>
                <div className="flex justify-end">
                  <button className="rounded-xl h-8 px-4 bg-[#0b80f4] text-white text-sm font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
