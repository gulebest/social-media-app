import React from 'react'

export default function CommentSkeleton() {
  return (
    <div className='bg-dark-3 p-3 rounded-2xl my-6'>
        <div className='flex gap-2 items-center'>
            <div className='w-10 h-10 bg-dark-4 rounded-full animate-pulse'></div>
            <div className='animate-pulse'>
                <div className='w-50 bg-dark-4 h-2 rounded-full'></div>
                <div className='w-30 mt-3 bg-dark-4 h-2 rounded-full'></div>            
            </div>
        </div>
 
 <div className='animate-pulse mt-8'>
    <div className='w-60 h-2 rounded-lg bg-dark-4'></div>
    <div className='w-35 h-2 rounded-lg bg-dark-4 mt-4'></div>
 </div>
    </div>
  )
}