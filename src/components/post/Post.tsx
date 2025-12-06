"use client";

import React, { Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { Post as PostType } from "../../../types/post";

const PostActions = React.lazy(() => import("./PostActions"));

type PostProps = {
  post: PostType;
  userId: string;
};

export default function Post({ post, userId }: PostProps) {
  const avatar = useMemo(() => post.author.image || "/images/avatar.png", [post.author.image]);
  const timeAgo = useMemo(() => moment(post.createdAt).fromNow(), [post.createdAt]);
  const username = useMemo(() => `@${post.author.username}`, [post.author.username]);

  return (
    <div className="bg-dark-3 p-8 mb-6 rounded-2xl my-6 shadow-md overflow-visible">
      <div className="flex gap-3 items-center">
        <div className="relative w-10 h-10">
          <Image
            src={avatar}
            alt="profile-pic"
            fill
            className="object-cover rounded-full border-2 border-dark-4 "
          />
        </div>

        <div className="flex flex-col ">
          <p className="font-semibold text-gray-100">{post.author.name}</p>
          <div className="flex items-center gap-2 py-0.5 mt-1">
            <span className="text-sm text-gray-400">{username}</span>
            <span className="text-sm text-primary font-semibold">{timeAgo}</span>
          </div>
        </div>
      </div>

      <Link href={`/post/${post.id}`}>
        {post.text && (
          <p className="py-6 text-gray-200 text-sm leading-relaxed">{post.text}</p>
        )}

        {post.image && (
          <div className="relative w-full min-h-80 sm:min-h-96 md:min-h-[28rem] overflow-hidden rounded-xl mb-4 gap-4">
            <Image
              src={post.image}
              alt="post-image"
              fill
              className="object-cover gap-4 pb-4"
            />
          </div>
        )}
      </Link>

      <Suspense fallback={<div className="h-10 animate-pulse bg-dark-4 rounded-md mt-4" />}>
        <PostActions
          postId={post.id}
          creatorId={post.author.id}
          userId={userId}
          postViewPage={false}
        />
      </Suspense>
    </div>
  );
}
