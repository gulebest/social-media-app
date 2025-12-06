"use client";
import React from "react";
import { useGetLikedPosts } from "../../../custom-hooks/usePost";
import { FaHeart } from "react-icons/fa";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

export default function LikedPosts({ userId }: { userId: string }) {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetLikedPosts();

  if (isLoading) return <PostSkeleton />;
  if (isError) return <p className="text-gray-300">{error.message}</p>;

  if (!data || data.pages.every(page => page.posts.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center px-4 bg-dark-2 p-4 rounded-2xl">
        <div className="text-gray-400 mb-4">
          <FaHeart size={50} />
        </div>
        <h3 className="text-xl font-semibold mb-2">No liked posts yet</h3>
        <p className="text-gray-600">
          Posts you like will appear here. Start exploring and liking posts!
        </p>
      </div>
    );
  }

  return (
    <>
      {data.pages.map((page, pageIndex) =>
        page.posts.map((post, postIndex) => (
          <Post
            post={post}
            userId={userId}
            key={`${post.id}-${pageIndex}-${postIndex}`} // unique key
          />
        ))
      )}
      {hasNextPage && (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-primary text-white py-2 px-4 rounded-full cursor-pointer"
          >
            {isFetchingNextPage ? "Loading" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
