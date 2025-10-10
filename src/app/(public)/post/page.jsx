import React from 'react'
import api from "@/lib/api"
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
export const dynamic = "force-dynamic"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
async function posts() {
    const res = await api.posts.list()
    return res
}
export const metadata = {
    title: "Posts | QuantumLeap",
    description: "Overview of your posts, chats, and collaborations.",
    alternates: { canonical: "/dashboard" },
    openGraph: {
        title: "Posts | QuantumLeap",
        description: "Overview of your posts, chats, and collaborations.",
        url: "https://quantum-desk.vercel.app/post",
    },
    twitter: {
        title: "Posts | QuantumLeap",
        description: "Overview of your posts, chats, and collaborations.",
    },
};
export default async function page() {
    const data = await posts()
    return (
        <div className="p-6 grid gap-6">
            {data?.data?.map((post) => (
                <Card key={post._id} className="overflow-hidden border border-[#223649] bg-[#101a23] text-white">
                    <CardContent className="p-4">
                        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                        <p className="text-[#90adcb] mb-3">{post.summary}</p>

                        {/* ✅ صورة مع fallback */}
                        {post.image ? (
                            <Image
                                width={1000}
                                height={600}
                                alt={post.title}
                                src={post.image}
                                className="rounded-xl object-cover max-h-[400px] w-full"
                            />
                        ) : (
                            <div className="h-[300px] w-full bg-[#223649] rounded-xl flex items-center justify-center text-gray-500">
                                No image
                            </div>
                        )}
                    </CardContent>

                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1 p-4">
                            <AccordionTrigger className={'ml-4 p-2'}>Show more</AccordionTrigger>
                            <AccordionContent className="p-4 font-bold text-[#c0c5d0]">
                                {post.content}
                                <Link href={`/post/${post._id}`} className="block w-max text-white text-center py-2 transition-colors">
                                    <Button variant={'ghost'}>View Details</Button>
                                </Link>
                            </AccordionContent>

                        </AccordionItem>
                    </Accordion>

                </Card>
            ))}
        </div>
    )
}
