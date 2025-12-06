"use client";
import Image from "next/image";
import React from "react";
import { useFollowSuggestions } from "../../../custom-hooks/useUsers";
import Link from "next/link";
import { useFollowUser } from "../../../custom-hooks/useFollow";
import { useSession } from "next-auth/react";
import RightSidebarSkeleton from "../skeletons/RightSidebarSkeleton";

export default function Rightsidebar() {
  const { data, error, isError, isLoading } = useFollowSuggestions();
  const { mutate: followUserMutation, isPending } = useFollowUser();
  const session = useSession();
  const authUserId = session.data?.user?.id;

  const handleFollow = (userId: string, username: string) => {
    if (!authUserId) return;
    followUserMutation({ userId, username, authUserId });
  };

  if (isLoading) return (
    <RightSidebarSkeleton/>
  )
  if (isError) return <p className="text-gray-300">{error.message}</p>;

  const users = data?.users ?? [];
  return (
    <aside className="min-h-screen fixed top-17 right-2 w-[300px] hidden xl:block">
      {users.length === 0 ? (
        <div className="bg-dark-3 mt-4 p-4 rounded-2xl text-center text-gray-400">
          <p>No user suggestions right now 👋</p>
          <p className="text-sm mt-1 text-gray-500">You’re all caught up!</p>
        </div>
      ) : (
        <>
         {users.map((user) => {
        return (
          <div
            key={user.id}
            className="bg-dark-3 p-4 rounded-2xl flex gap-2 items-center my-3 cursor-pointer hover:bg-dark-2 transition"
          >
            <Link href={`/users/${user.username}`}>
              <div className="relative w-14 h-14">
                <Image
                  fill
                  src={user.image || "/images/avatar.png"}
                  alt="profile-pic"
                  className="rounded-full object-cover"
                />
              </div>
            </Link>
            <div>
              <Link href={`/users/${user.username}`}>
                <p className="text-gray-200">{user.name}</p>
                <p className="text-gray-400">@{user.username}</p>
              </Link>
              <button
              disabled={isPending}
                onClick={() => handleFollow(user.id, user.username)}
                className="text-white cursor-pointer bg-primary mt-4 px-4 py-2 rounded-full"
              >
                Follow
              </button>
            </div>
          </div>
        );
      })}
        </>
      )}
     
    </aside>
  );
}