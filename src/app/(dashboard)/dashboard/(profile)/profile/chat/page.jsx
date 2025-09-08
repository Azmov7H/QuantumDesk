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
     <div className='flex p-8 gap-8'>
       <div className='w-2/5'>
         <Input placeholder='Search ' className='mb-6 bg-[#362447] border-none' />
       
       <NewChat />

       <div className='my-4'>
        <ChatContacts />
       </div>
       
       </div>


       <div className='w-3/5 flex gap-12'>
        <div className='w-2/5'>
        <Chatroup />
       
        </div>
        <div className='w-3/5'>
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
