import Chatroup from '@/app/components/Chatroup'
import ChatContacts from '@/app/components/ChatContacts'
import NewChat from '@/app/components/NewChat'
import { Input } from '@/components/ui/input'
import React from 'react'
import SharedDocuments from '@/app/components/SharedDocuments'
import PinnedMessages from '@/app/components/PinnedMessages'


export default function Chat() {
  return (
   <>
     <div className='sm:flex-col md:flex-row flex p-8 gap-8'>
       <div className='sm:w-full lg:w-2/5'>
         <Input placeholder='Search ' className='mb-6 bg-[#362447] border-none' />
       
       <NewChat />

       <div className='my-4'>
        <ChatContacts />
       </div>
       
       </div>


       <div className='sm:w-full lg:w-3/5 sm:flex-col lg:flex-row flex gap-12'>
        <div className='sm:w-full lg:w-2/5'>
        <Chatroup />
       
        </div>
        <div className='sm:w-full lg:w-3/5'>
         <div className='my-6'>
          <SharedDocuments />
        </div>
        <PinnedMessages />
        
        </div>
       </div>
      </div>
   </>
  )
}
