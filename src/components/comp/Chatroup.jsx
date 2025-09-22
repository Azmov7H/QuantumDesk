import React from 'react'
import Sender from './Sender'
import Receiver from './Receiver'

export default function Chatroup() {
  return (
    <>
    <h2 className='text-white'>Dr. Evelyn Reed, Dr. Marcus Cole, Dr. Sophia Chen</h2>
    <p className='text-white mb-6'>Status: Active</p>

    <Sender />
    <Receiver />

    </>
  )
}
