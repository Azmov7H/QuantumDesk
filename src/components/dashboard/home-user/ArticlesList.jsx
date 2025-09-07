"use client"
import ArticleCard from "./ArticleCard"

const articles = [
  {
    status: "Approved",
    title: "Advancements in Quantum Computing",
    description: "This article explores the latest breakthroughs in quantum computing...",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiFsmRTEZ..."
  },
  {
    status: "Pending",
    title: "The Future of AI in Healthcare",
    description: "An in-depth analysis of how AI is transforming healthcare...",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIbMhmlq..."
  },
  // باقي المقالات...
]

export default function ArticlesList() {
  return (
    <div className="flex flex-col">
      {articles.map((article, i) => (
        <ArticleCard key={i} {...article} />
      ))}
    </div>
  )
}
