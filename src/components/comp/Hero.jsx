"use client"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import React from "react"

export default function Hero() {
  return (
    <Card className="w-full min-h-[400px] md:min-h-[512px] py-10 px-4 md:px-16 bg-[url('/bg.png')] bg-cover bg-center">
      <section className="flex flex-col items-center text-center gap-6">
        <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Accelerating Scientific Discovery
        </CardTitle>
        <CardDescription className="text-base sm:text-lg max-w-2xl text-white/80">
          QuantumLeap is a collaborative platform for researchers to publish, explore, and connect with peers in their field.
        </CardDescription>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/auth/login">
            <Button className="bg-[#1A8CE5] text-white px-6 py-2 text-base">Explore Articles</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="px-6 py-2 text-base  border-white hover:bg-white/10">
              Join Now
            </Button>
          </Link>
        </div>
      </section>
    </Card>
  )
}
