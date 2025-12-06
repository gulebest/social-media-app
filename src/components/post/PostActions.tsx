"use client";

import React, { useCallback } from "react";
import { FaRegCommentDots, FaRegTrashAlt } from "react-icons/fa";
import { useDeletePost, usePostStats } from "../../../custom-hooks/usePost";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LikeButton from "../like/LikeButton";
import PostActionsSkeleton from "../skeletons/PostActionsSkeleton";
import { useQueryClient } from "@tanstack/react-query";

type PostActionsProps = {
  userId: string;
  creatorId: string;
  postId: string;
  postViewPage: boolean;
};

function PostActions({ userId, creatorId, postId, postViewPage }: PostActionsProps) {
  const { mutate: deletePostMutation } = useDeletePost();
  const { data, isLoading } = usePostStats(postId);
  const router = useRouter();
  const queryClient = useQueryClient();

  const commentCount = data?.commentsCount ?? 0;

  // Delete post handler with type-safe React Query invalidation
  const handleDeletePost = useCallback(() => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    deletePostMutation(postId, {
      onSuccess: () => {
        if (postViewPage) router.replace("/");
        toast("Post deleted successfully", {
          style: { background: "#5D5FEF", color: "white" },
        });
        // ✅ Type-safe invalidation in React Query v4
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  }, [deletePostMutation, postId, postViewPage, router, queryClient]);

  if (isLoading || !data) return <PostActionsSkeleton />;

  return (
    <div className="mt-4 mx-1 flex gap-6">
      {/* Like Button with real-time updates */}
      <LikeButton postId={postId} postStats={data} />

      {/* Comment Button */}
      <button
        aria-label="View comments"
        className="text-gray-300 cursor-pointer flex items-center gap-1"
      >
        <FaRegCommentDots size={20} />
        <span className="text-xs">{commentCount}</span>
      </button>

      {/* Delete Button (only for post creator) */}
      {userId === creatorId && (
        <button
          aria-label="Delete post"
          onClick={handleDeletePost}
          className="text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <FaRegTrashAlt size={20} />
        </button>
      )}
    </div>
  );
}

export default React.memo(PostActions);
