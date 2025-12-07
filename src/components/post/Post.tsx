"use client";

import React, { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { Post as PostType } from "../../../types/post";
import { FaCommentDots } from "react-icons/fa";

const PostActions = React.lazy(() => import("./PostActions"));

type PostProps = {
  post: PostType;
  userId: string;
};

export default function Post({ post, userId }: PostProps) {
  const [showComments, setShowComments] = useState(false);

  const avatar = useMemo(
    () => post.author.image || "/images/avatar.png",
    [post.author.image]
  );
  const timeAgo = useMemo(() => moment(post.createdAt).fromNow(), [post.createdAt]);
  const username = useMemo(() => `@${post.author.username}`, [post.author.username]);

  return (
    <div className="bg-dark-3 p-6 rounded-2xl shadow-md">
      {/* User Header */}
      <div className="flex gap-3 items-center">
        <div className="relative w-10 h-10">
          <Image
            src={avatar}
            alt="profile-pic"
            fill
            className="object-cover rounded-full border-2 border-dark-4"
          />
        </div>

        <div className="flex flex-col">
          <p className="font-semibold text-gray-100">{post.author.name}</p>
          <div className="flex items-center gap-2 py-0.5 mt-1">
            <span className="text-sm text-gray-400">{username}</span>
            <span className="text-sm text-primary font-semibold">{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`}>
        {post.text && (
          <p className="py-4 text-gray-200 text-sm leading-relaxed">{post.text}</p>
        )}

        {post.image && (
          <div className="relative w-full min-h-80 sm:min-h-96 md:min-h-[28rem] overflow-hidden rounded-xl mb-3">
            <Image
              src={post.image}
              alt="post-image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </Link>

      {/* Actions */}
      <Suspense
        fallback={<div className="h-10 animate-pulse bg-dark-4 rounded-md mt-4" />}
      >
        <PostActions
          postId={post.id}
          creatorId={post.author.id}
          userId={userId}
          postViewPage={false}
        />
      </Suspense>

      {/* Comment Toggle */}
      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="flex items-center gap-2 mt-3 text-gray-300 hover:text-primary transition"
      >
        <FaCommentDots size={18} />
        <span className="text-sm font-medium">
          {showComments ? "Hide comments" : "View comments"}
        </span>
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4">
          {/* Will be replaced when you send me these files */}
          {/* <CommentInput postId={post.id} /> */}
          {/* <Comments postId={post.id} /> */}
        </div>
      )}
    </div>
  );
}
