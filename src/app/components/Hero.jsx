"use client"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import React from "react"

export default function Hero() {
  return (
    <section className="w-full py-10 px-4 md:px-16 bg-white">
      <Card className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-6 md:p-10 shadow-lg border border-muted">
        {/* Image */}
        <div className="w-full flex justify-center">
          <Image
            src="/Hero.png"
            width={400}
            height={300}
            className="w-full max-w-md object-contain"
            alt="Hero image"
            loading="lazy"
          />
        </div>

        {/* Text */}
        <div className="space-y-6">
          <CardTitle className="text-3xl md:text-5xl font-bold text-primary">
            Revolutionize Your Research Workflow
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg leading-relaxed">
            QuantumLeap is a cutting-edge platform designed to empower researchers in Quantum Mechanics and General Relativity. Streamline your experiments, analyze data efficiently, and collaborate seamlessly with colleagues.
          </CardDescription>

          <div className="flex flex-col items-center sm:flex-row gap-4">
            <Link href="/auth/login">
              <Button variant={"ghost"} className="bg-[#1A8CE5] text-white px-6 py-2 text-base">Get Started</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="px-6 py-2 text-base">Learn More</Button>
            </Link>
          </div>
        </div>
      </Card>
    </section>
  )
}
