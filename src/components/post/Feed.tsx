"use client";
import React, { useEffect } from "react";
import Post from "./Post";
import { useInfinitePosts } from "../../../custom-hooks/usePost";
import { useInView } from "react-intersection-observer";
import PostSkeleton from "../skeletons/PostSkeleton";

export default function Feed({userId}:{userId:string}) {
  const { inView, ref } = useInView();
  const {
    isLoading,
    data,
    isFetchingNextPage,
    error,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useInfinitePosts();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];
  if (isLoading) return <PostSkeleton/>
  if (isError) return <p className="text-gray-300">{error.message}</p>;
  return (
    <div className="mt-6">
      {allPosts.map((post, index) => {
        return (
          <div key={post.id} ref={index === allPosts.length - 1 ? ref : null}>
            <Post userId={userId} post={post} />
          </div>
        );
      })}
      {isFetchingNextPage && <PostSkeleton/>}
    </div>
  );
}