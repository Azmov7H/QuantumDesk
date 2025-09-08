import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'

export default function Sender() {
  return (
    <>
    <div className='flex gap-4 text-white'>
        <Image src='/dr1.png' alt='dr img' width={60} height={50} className='rounded-full ' />
        <Input className='mb-6 bg-[#362447] border-none'/>
    </div>
    </>
  )
}
