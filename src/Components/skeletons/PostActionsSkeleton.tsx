import React from 'react'

export default function PostActionsSkeleton() {
  return (
    <div className='flex gap-3 items-center justify-center animate-pulse w-[120px]'>
         <div className="w-6 h-6 rounded-lg bg-dark-4"></div>
         <div className="w-6 h-6 rounded-lg bg-dark-4"></div>
         <div className="w-6 h-6 rounded-lg bg-dark-4"></div>
    </div>
  )
}