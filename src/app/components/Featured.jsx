import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

export default function Featured() {
  const articles = [
    {
      title: "Quantum Entanglement in Complex Systems",
      author: "Dr. Anya Sharma",
      image: "3 (1).svg",
    },
    {
      title: "Exploring Dark Matter Structures",
      author: "Dr. Isaac Kim",
      image: "3 (2).svg",
    },
    {
      title: "Advancements in Quantum Computing",
      author: "Dr. Laila Khan",
      image: "3 (3).svg",
    },
  ]

  return (
    <div className='flex w-full flex-col items-start gap-6 mb-20'>
      <h2 className="text-3xl text-white font-semibold">Featured Articles</h2>

      <section className='grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {articles.map((article, index) => (
          <Card
            key={index}
            className="overflow-hidden pt-0 bg-white/10 backdrop-blur-md text-white shadow-md hover:shadow-lg transition rounded-xl"
          >
            <Image
              src={article.image}
              width={400}
              height={200}
              alt={article.title}
              className="w-full h-48 object-cover"
              loading='eager'
            />
            <CardHeader>
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <CardDescription className="text-white/70">{article.author}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  )
}
