import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <>
    <div className='text-[#8FADCC] h-[152px] py-8 mt-26 w-[80%] mx-auto'>
        <ul className='flex justify-between mb-16'>
            <li> <Link href='/'>About </Link> </li>
            <li> <Link href='/'>Contact </Link> </li>
            <li> <Link href='/'>Terms Of Service </Link> </li>
            <li> <Link href='/'>Privacy Policy </Link> </li>
        </ul>

        <p className='text-center pb-14 text-xl'>© 2024 QuantumLeap. All rights reserved.</p>
    </div>
    </>
  )
}
