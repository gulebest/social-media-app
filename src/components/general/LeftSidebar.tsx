"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetUser } from "../../../custom-hooks/useUser";
import LeftSidebarSkeleton from "../skeletons/LeftSidebarSkeleton";


export default function LeftSidebar() {
  const { isLoading, isError, error, data: user } = useGetUser();

  if (isLoading) return <LeftSidebarSkeleton/>
  if (isError) return <h1 className="text-gray-300">{error.message}</h1>;

  return (
    <aside className="min-h-screen fixed top-17 left-20 w-[350px] hidden lg:block">
      <div className="bg-dark-3 rounded-2xl m-5 p-4">
        <div className="flex gap-3 items-center justify-center">
          <div className="text-center text-gray-200">
            <p className="font-semibold">{user?._count.followers}</p>
            <p className="font-normal text-gray-400 text-xs">Followers</p>
          </div>
          <div className="relative w-20 h-20">
            <Image
              src={user?.image || "/images/profile.jpg"}
              alt="profile-pic"
              className="object-cover rounded-full border-6 border-dark-4"
              fill
            />
          </div>
          <div className="text-center text-gray-200">
            <p className="font-semibold">{user?._count.following}</p>
            <p className="font-normal text-gray-400 text-xs">Following</p>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-200">
          <p className="text-lg font-bold">{user?.name}</p>
          <p className="text-gray-400 text-sm">@{user?.username}</p>
          <p className="text-sm mt-6">
            {user?.bio || "Your bio will help others get to know you better!"}
          </p>
        </div>
        <Link
          href="/profile"
          className="bg-primary w-full text-center block text-white mt-12 py-2 rounded-full cursor-pointer"
        >
          Profile
        </Link>
      </div>
    </aside>
  );
}