import React from 'react'

export default function PostSkeleton() {
  return (
    <div className='bg-dark-3 p-3 rounded-2xl my-6'>
        <div className='flex gap-2 items-center'>
            <div className='w-10 h-10 bg-dark-4 rounded-full animate-pulse'></div>
            <div className='animate-pulse'>
                <div className='w-50 bg-dark-4 h-2 rounded-full'></div>
                <div className='w-30 mt-3 bg-dark-4 h-2 rounded-full'></div>            
            </div>
        </div>

        <div className='w-full md:h-120 sm:h-100 h-80 bg-dark-4 rounded-2xl animate-pulse mt-4'></div>
    </div>
  )
}