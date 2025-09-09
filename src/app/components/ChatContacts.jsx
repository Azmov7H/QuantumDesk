'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

export default function ChatContacts() {
    const doctors = [
  {
    name: "Dr. Evelyn",
    lastName: "Reed",
    message: "Great",
    avatar: "/dr1.png"
  },
  {
    name: "Dr. Marcus",
    lastName: "Cole",
    message: "Let's",
    avatar: "/dr2.png"
  },
  {
    name: "Dr. Sophia",
    lastName: "Chen",
    message: "I've",
    avatar: "/dr3.png"
  },
  {
    name: "Dr. Ethan",
    lastName: "Blake",
    message: "",
    avatar: "/dr4.png"
  }
];

const [contacts, setContacts] = useState(doctors);

  return (
    <>
    {contacts? contacts.map((contact)=>{
     return    <Link href='/' className='flex items-center gap-4 mb-8' key={contact.name}>
            <Image src={contact.avatar} width={50} height={50} className='rounded-full' alt='Dr img' />
            <div>
                <h3 className='text-white'>{contact.name}</h3>
                <p className='text-[#AD91C9]'>{contact.lastName}</p>
                <p className='text-[#AD91C9]'>{contact.message}</p>
            </div>
        </Link>
    }):(
        <p>Loadin...</p>
    )}
    </>
  )
}
