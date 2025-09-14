import { Button } from '@/components/ui/button'
import React from 'react'

export default function page() {
    return (
        <div>
            <div className="title text-2xl flex flex-col items-center justify-cente text-center text-white gap-5">
                <div className="intro">
                      <h2 className='font-bold'>Welcome to QuantumLeap</h2>
                <p>QuantumLeap is a collaborative platform for scientific publishing and discovery. Explore articles, connect with researchers, and share your work.</p>
               </div>
                <div className="buttons flex gap-3 items-center justify-center">
                    <Button variant={'ghost'} className={'bg-purple-700'}>Explore Articles</Button>
                    <Button variant={'ghost'}>Complete Profile</Button>
                </div>
            </div>
        </div>
    )
}
