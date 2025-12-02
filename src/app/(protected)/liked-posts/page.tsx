import React from 'react'
import { auth } from '../../../auth'
import LikedPosts from '@/components/post/LikedPosts';

export default async function Page() {
    const session = await auth();
  return (
    <>
    {session?.user?.id && <LikedPosts userId={session.user.id}/>}
    </>
    
  )
}