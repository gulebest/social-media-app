import React from 'react'

export default function ProfileSkeleton() {
  return (
    <div className='bg-dark-3 px-4 py-8 rounded-2xl'>
        <div className='h-25 w-25 rounded-full bg-dark-4 animate-pulse'></div>
        <div className='animate-pulse my-6'>
            <div className='w-50 h-3 bg-dark-4 rounded-lg'></div>
            <div className='w-30 h-3 bg-dark-4 rounded-lg mt-3'></div>
            <div className='w-45 h-3 bg-dark-4 rounded-lg  mt-6'></div>
            <div className='w-[50%] flex justify-between mt-10'>
                <div className='animate-pulse flex items-center flex-col'>
                    <div className='w-6 h-6 rounded-lg bg-dark-4'></div>
                    <div className='w-10 h-2 rounded-lg bg-dark-4 mt-2'></div>
                </div>
                <div className='animate-pulse flex items-center flex-col'>
                    <div className='w-6 h-6 rounded-lg bg-dark-4'></div>
                    <div className='w-10 h-2 rounded-lg bg-dark-4 mt-2'></div>
                </div>
                <div className='animate-pulse flex items-center flex-col'>
                    <div className='w-6 h-6 rounded-lg bg-dark-4'></div>
                    <div className='w-10 h-2 rounded-lg bg-dark-4 mt-2'></div>
                </div>
            </div>
        </div>
    </div>
  )
}