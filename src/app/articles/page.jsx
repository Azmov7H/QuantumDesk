'use client'
import { Button } from '@/components/ui/button'
import { DropdownMenu ,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import Image from 'next/image';
import React, { useState } from 'react'

export default function Page() {

  const articles = [
  {
    id:1,
    status: "Approved",
    heading: "AI Revolution in Healthcare",
    description: "How AI is transforming patient care, diagnostics, and healthcare efficiency worldwide.",
    image: "/ar1.png"
  },
  {
    id:2,
    status: "Pending",
    heading: "Sustainable Energy Trends 2025",
    description: "An overview of the latest green energy solutions and renewable innovations.",
    image: "/ar2.png"
  },
  {
    id:3,
    status: "Approved",
    heading: "The Future of Remote Work",
    description: "Exploring hybrid work models and remote collaboration tools for modern teams.",
    image: "/ar3.png"
  },
  {
    id:4,
    status: "Rejected",
    heading: "Blockchain Beyond Cryptocurrency",
    description: "Discover how blockchain is revolutionizing supply chains, voting systems, and more.",
    image: "/ar4.png"
  },
  {
    id:5,
    status: "Pending",
    heading: "Space Tourism: Next Frontier",
    description: "A closer look at how commercial space travel is becoming a reality.",
    image: "/ar5.png"
  },
  {
    id:6,
    status: "Approved",
    heading: "Cybersecurity in a Digital Age",
    description: "Key strategies for protecting personal and organizational data from cyber threats.",
    image: "/ar1.png"
  },
  {
    id:7,
    status: "Rejected",
    heading: "AR & VR in Education",
    description: "How immersive technologies are reshaping learning experiences worldwide.",
    image: "/ar2.png"
  },
  {
    id:8,
    status: "Pending",
    heading: "The Rise of Electric Vehicles",
    description: "Examining the latest developments and challenges in EV adoption.",
    image: "/ar3.png"
  }
];
const [recentArticles, setRecentArticles]= useState(articles);

  return (
   <>
  <h2> My Articles</h2>
  <div className='flex gap-4 mb-12 max-w-[75%] mx-auto'> 
    <DropdownMenu  >
          <DropdownMenuTrigger className="bg-blue-500 text-white" asChild>
            <Button variant='outline'>Status</Button>
          </DropdownMenuTrigger> 
      <DropdownMenuContent className="bg-blue-500 text-white">
        <DropdownMenuItem>Approved</DropdownMenuItem>
        <DropdownMenuItem>Pending</DropdownMenuItem>

      </DropdownMenuContent>
       
    </DropdownMenu>

     <DropdownMenu  >
          <DropdownMenuTrigger className="bg-blue-500 text-white" asChild>
            <Button variant='outline'>Category</Button>
          </DropdownMenuTrigger> 
      <DropdownMenuContent className="bg-blue-500 text-white">
        <DropdownMenuItem>Approved</DropdownMenuItem>
        <DropdownMenuItem>Pending</DropdownMenuItem>

      </DropdownMenuContent>
       
    </DropdownMenu>

     <DropdownMenu  >
          <DropdownMenuTrigger className="bg-blue-500 text-white" asChild>
            <Button variant='outline'>Tages</Button>
          </DropdownMenuTrigger> 
      <DropdownMenuContent className="bg-blue-500 text-white">
        <DropdownMenuItem>Approved</DropdownMenuItem>
        <DropdownMenuItem>Pending</DropdownMenuItem>

      </DropdownMenuContent>
       
    </DropdownMenu>
  </div>

  <div className='max-w-[75%] mx-auto'>
    {articles? articles.map((article)=>
    <div key={article.id} className='mb-8 flex justify-between'>
    <div className='pt-6'>
    <p>{article.status}</p>
     <h2>{article.heading}</h2>
     <p>{article.description}</p>
      </div>
      <div>
      <Image src={article.image} width={300} height={150} alt={article.heading}/>
      </div>
      </div>
    
    ) : (<p>Loadin....</p>)}
  </div>
    </>
  )
}
