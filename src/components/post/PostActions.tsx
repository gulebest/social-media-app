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
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deletePostMutation } = useDeletePost();
  const { data, isLoading } = usePostStats(postId);

  const stats = data || { likesCount: 0, commentsCount: 0, liked: false };
  const commentCount = stats.commentsCount ?? 0;

  // Delete post
  const handleDeletePost = useCallback(() => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    deletePostMutation(postId, {
      onSuccess: () => {
        if (postViewPage) router.replace("/");
        toast("Post deleted successfully", {
          style: { background: "#5D5FEF", color: "white" },
        });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
  }, [deletePostMutation, postId, postViewPage, router, queryClient]);

  if (isLoading || !data) return <PostActionsSkeleton />;

  return (
    <div className="mt-4 mx-1 flex gap-6 items-center">
      {/* LIKE BUTTON */}
      <LikeButton postId={postId} postStats={stats} />

      {/* COMMENT BUTTON */}
      <button
        aria-label="View comments"
        onClick={() => router.push(`/post/${postId}`)}
        className="text-gray-300 cursor-pointer flex items-center gap-1"
      >
        <FaRegCommentDots size={20} />
        <span className="text-xs">{commentCount}</span>
      </button>

      {/* DELETE POST */}
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
