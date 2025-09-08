import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'

export default function Receiver() {
  return (
    <>
    <div className='flex gap-4 text-white my-3'>
         <Input className='mb-6 bg-[#8012ED] border-none'/>
        <Image src='/dr2.png' alt='dr img' width={60} height={50} className='rounded-full ' />
       
    </div>
    </>
  )
}
