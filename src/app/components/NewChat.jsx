import React from 'react'
import { FaPlus } from "react-icons/fa6";

export default function NewChat() {
  return (
    <>
     <div className='flex gap-4 items-center'>
            <p className='bg-[#362447] rounded-md p-2 flex items-center justify-center'>
                <FaPlus className='text-white text-2xl' />
                
            </p>
        <p  className='text-white' >New Chat</p>
     </div>
    </>
  )
}
