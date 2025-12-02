"use client";
import React from "react";
import { FaRegCommentDots, FaRegTrashAlt } from "react-icons/fa";
import { useDeletePost, usePostStats } from "../../../custom-hooks/usePost";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LikeButton from "../like/LikeButton";
import PostActionsSkeleton from "../skeletons/PostActionsSkeleton";

type PostActionsProps = {
  userId: string;
  creatorId: string;
  postId: string;
  postViewPage: boolean;
};

export default function PostActions({
  userId,
  creatorId,
  postId,
  postViewPage,
}: PostActionsProps) {
  const { mutate: DeletePostMutation } = useDeletePost();
  const { data, isLoading } = usePostStats(postId);
  const commentCount = data?.commentsCount;
  const router = useRouter();

  const handleDeletePost = (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    DeletePostMutation(postId, {
      onSuccess: () => {
        if (postViewPage) {
          router.replace("/");
        }
        toast("Post deleted successfully", {
          style: {
            background: "#5D5FEF",
            color: "white",
          },
        });
      },
    });
  };

  if (isLoading) return <PostActionsSkeleton />;

  if (data) {
    return (
      <div className="mt-4 mx-1 flex gap-6">
        <LikeButton postId={postId} postStats={data} />

        {/* Comment Button (Already Has Text → No Warning) */}
        <button
          aria-label="View comments"
          className="text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <FaRegCommentDots size={20} />
          <span className="text-xs">{commentCount}</span>
        </button>

        {/* Delete Button (Icon Only → MUST add aria-label) */}
        {userId === creatorId && (
          <button
            aria-label="Delete post"
            onClick={() => handleDeletePost(postId)}
            className="text-gray-300 cursor-pointer flex items-center gap-1"
          >
            <FaRegTrashAlt size={20} />
          </button>
        )}
      </div>
    );
  }
}
