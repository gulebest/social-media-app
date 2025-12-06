"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useVirtual } from "react-virtual";
import { useInfinitePosts } from "../../../custom-hooks/usePost";
import { useQueryClient } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import CreatePostInput from "./CreatePostInput";
import { Post as PostType } from "../../../types/post";

type FeedProps = {
  userId: string;
};

export default function Feed({ userId }: FeedProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfinitePosts();

  // Flatten all pages into a single array
  const posts: PostType[] = useMemo(
    () => data?.pages.flatMap((page) => page.posts) || [],
    [data]
  );

  // Virtualizer setup
  const rowVirtualizer = useVirtual({
    size: posts.length,
    parentRef,
    estimateSize: React.useCallback(() => 300, []),
    overscan: 5,
  });

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Optional: refetch feed every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }, 5000);
    return () => clearInterval(interval);
  }, [queryClient]);

  if (isLoading) return <PostSkeleton />;
  if (error) return <p className="text-red-400">{error.message}</p>;

  return (
    <div>
      {/* Post creation form */}
      <CreatePostInput/>

      {/* Virtualized feed */}
      <div ref={parentRef} className="h-[80vh] overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const post = posts[virtualRow.index];
            if (!post) return null;

            const isLastPost = virtualRow.index === posts.length - 1;

            return (
              <div
                key={post.id}
                ref={isLastPost ? inViewRef : undefined}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <Post userId={userId} post={post} />
              </div>
            );
          })}

          {isFetchingNextPage && <PostSkeleton />}
        </div>
      </div>
    </div>
  );
}
