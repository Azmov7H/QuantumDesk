"use client"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function Hero() {
  return (
    <Card className="w-full h-96 md-[512px] py-10 px-4 md:px-16 bg-[url('/bg.png')] bg-cover bg-center">
      <section className="gap-8 p-6 md:p-10  border-none   bg-transparent">
        <div className="flex flex-col gap-2 md:gap-4 items-center text-center">
          <CardTitle className="text-3xl md:text-5xl font-bold text-white">
            Accelerating Scientific Discovery
          </CardTitle>
          <CardDescription className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            QuantumLeap is a collaborative platform for researchers to publish, explore, and connect with peers in their field.
          </CardDescription>

          <div className="flex flex-col items-center sm:flex-row gap-4 mt-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="bg-[#1A8CE5] text-white px-6 py-2 text-base">Explore Articles</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="px-6 py-2 text-base text-white">Join Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </Card>
  )
}
