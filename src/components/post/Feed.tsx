"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useInfinitePosts } from "../../../custom-hooks/usePost";
import { useVirtualizer } from "@tanstack/react-virtual";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { Post as PostType } from "../../../types/post";

type FeedProps = {
  userId: string;
};

export default function Feed({ userId }: FeedProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfinitePosts();

  const posts: PostType[] = useMemo(
    () => data?.pages.flatMap((page) => page.posts) || [],
    [data]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 360,
    overscan: 4,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <PostSkeleton />;
  if (error) return <p className="text-red-400">{error.message}</p>;

  return (
    <div>
      <div ref={parentRef} className="h-[80vh] overflow-auto">
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((item) => {
            const post = posts[item.index];
            if (!post) return null;

            const isLastPost = item.index === posts.length - 1;

            return (
              <div key={post.id} ref={isLastPost ? inViewRef : undefined}>
                <div className="px-2 mb-[6px]">
                  <Post userId={userId} post={post} />
                </div>
              </div>
            );
          })}

          {isFetchingNextPage && <PostSkeleton />}
        </div>
      </div>
    </div>
  );
}
