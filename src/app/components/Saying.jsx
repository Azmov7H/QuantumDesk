'use client'

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from "lucide-react"
import React, { useRef } from 'react'
import Link from 'next/link'

export default function Saying() {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current
            const scrollAmount = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
            scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    const testimonials = [
        {
            name: "Dr. Anya Sharma",
            field: "Physics",
            quote: "QuantumLeap has revolutionized the way I share my research. The platform is intuitive and the community is incredibly supportive.",
            image: "S1.svg",
        },
        {
            name: "Dr. Isaac Kim",
            field: "Astrophysics",
            quote: "Finally, a place where science and technology meet. QuantumLeap helps me connect with peers like never before.",
            image: "S2.svg",
        },
        {
            name: "Dr. Laila Khan",
            field: "Quantum Computing",
            quote: "The UI is stunning and the publishing experience is smooth. Highly recommended for serious researchers.",
            image: "S3.svg",
        },
    ]

    return (
        <div className="w-full flex flex-col gap-6 relative">
            <h2 className="text-3xl font-semibold text-white">What Scientists Are Saying</h2>

            {/* Slider Controls on small screens */}
            <div className="relative md:hidden">
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 scrollbar-hide"
                >
                    {testimonials.map((testimonial, idx) => (
                        <Card
                            key={idx}
                            className="snap-start min-w-[90%] sm:min-w-[300px] bg-white/10 backdrop-blur-md !border-0 text-white p-4 "
                        >
                            <div className="flex flex-col items-center gap-4 mb-4">
                                <Avatar className="md:h-[288px] md:w-[288px] rounded-xl overflow-hidden">
                                    <AvatarImage src={testimonial.image} className="md:h-full md:w-full md:rounded-full object-cover" />
                                    <AvatarFallback className="text-4xl">
                                        {testimonial.name.split(" ")[1]?.[0] ?? ''}{testimonial.name.split(" ")[0]?.[0]}
                                    </AvatarFallback>

                                </Avatar>
                                <div className="flex flex-col items-center text-center">
                                    <span className="font-medium">{testimonial.name}</span>
                                    <span className="text-sm text-white/60">{testimonial.field}</span>
                                </div>
                            </div>
                            <p className="text-white/90 text-sm mb-2 line-clamp-4">"{testimonial.quote}"</p>

                            <Link href={'/'} className="text-white/70 text-xs hover:underline">View Profile</Link>
                        </Card>
                    ))}
                </div>

            </div>

            {/* Grid layout for medium and up */}
            <section className="hidden md:grid grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                    <Card
                        key={idx}
                        className="bg-white/10 backdrop-blur-md text-white p-4 rounded-xl"
                    >
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <Avatar className="h-[288px] w-[288px] rounded-xl overflow-hidden">
                                <AvatarImage src={testimonial.image} className="h-full w-full object-cover" />
                                <AvatarFallback className="text-4xl">
                                    {testimonial.name.split(" ")[1][0]}{testimonial.name.split(" ")[0][0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-center text-center">
                                <span className="font-medium">{testimonial.name}</span>
                                <span className="text-sm text-white/60">{testimonial.field}</span>
                            </div>
                        </div>
                        <p className="text-white/90 text-sm mb-2">"{testimonial.quote}"</p>
                        <Link href={'/'} className="text-white/70 text-xs hover:underline">View Profile</Link>
                    </Card>
                ))}
            </section>
        </div>
    )
}
