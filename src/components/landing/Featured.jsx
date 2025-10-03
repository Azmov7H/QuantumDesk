"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export default function Featured() {
  const articles = [
    {
      title: "Quantum Entanglement in Complex Systems",
      author: "Dr. Anya Sharma",
      image: "https://images.unsplash.com/photo-1726066012678-211c2e2d4fa7?q=80&w=1974&auto=format&fit=crop",
    },
    {
      title: "Exploring Dark Matter Structures",
      author: "Dr. Isaac Kim",
      image: "https://images.unsplash.com/photo-1733509213080-db2aca1bc244?q=80&w=2070&auto=format&fit=crop",
    },
    {
      title: "Advancements in Quantum Computing",
      author: "Dr. Laila Khan",
      image: "https://images.unsplash.com/photo-1749745171171-08e9c3638b0c?q=80&w=1974&auto=format&fit=crop",
    },
  ];

  return (
    <section className="flex w-full flex-col gap-6">
      <h2 className="text-2xl sm:text-3xl text-white font-semibold">Featured Articles</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Card
            key={index}
            className="overflow-hidden dark:bg-white/10 backdrop-blur-md dark:text-white shadow-md hover:shadow-lg transition rounded-xl"
          >
            <Image
              src={article.image}
              width={400}
              height={200}
              alt={article.title}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
              loading="lazy"
            />
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{article.title}</CardTitle>
              <CardDescription className="text-white/70">{article.author}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
