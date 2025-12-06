import { useSession } from "next-auth/react";
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useLikePost, useUnlikePost } from "../../../custom-hooks/useLike";
import { PostStats } from "../../../types/post";
import { useQueryClient } from "@tanstack/react-query";

type LikeButtonProps = {
  postId: string;
  postStats: PostStats;
};

export default function LikeButton({ postId, postStats }: LikeButtonProps) {
  const { mutate: likePostMutation, isPending: liking } = useLikePost();
  const { mutate: unlikePostMutation, isPending: unliking } = useUnlikePost();

  const session = useSession();
  const userId = session.data?.user?.id;
  const queryClient = useQueryClient();

  // ✅ ALWAYS read the latest value from cache (fixes NaN + stale UI)
  const cachedStats =
    queryClient.getQueryData<PostStats>(["postStats", postId]) || postStats;

  const hasLiked = Boolean(cachedStats.liked);
  const likesCount = Number(cachedStats.likesCount ?? 0);

  const handleLikeToggle = () => {
    if (!userId) return;

    const previousStats = cachedStats;

    // --- Optimistic update ---
    queryClient.setQueryData<PostStats>(["postStats", postId], {
      ...cachedStats,
      liked: !hasLiked,
      likesCount: hasLiked ? likesCount - 1 : likesCount + 1,
    });

    // --- Server mutation ---
    if (hasLiked) {
      unlikePostMutation(postId, {
        onError: () => {
          queryClient.setQueryData(["postStats", postId], previousStats);
        },
      });
    } else {
      likePostMutation(
        { postId, userId },
        {
          onError: () => {
            queryClient.setQueryData(["postStats", postId], previousStats);
          },
        }
      );
    }
  };

  const loading = liking || unliking;

  return (
    <button
      disabled={loading}
      onClick={handleLikeToggle}
      className={`cursor-pointer flex items-center gap-1 ${
        hasLiked ? "text-pink-600" : "text-gray-300"
      }`}
    >
      {hasLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
      <span className="text-xs">{likesCount}</span>
    </button>
  );
}
