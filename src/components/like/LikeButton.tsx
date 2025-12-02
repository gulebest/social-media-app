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
  const hasLiked = postStats.liked;
  const likesCount = postStats.likesCount;
  const queryClient = useQueryClient();

  const handleLikeToggle = () => {
    if (!userId) return;

    //store previous stats
    const previousStats = queryClient.getQueryData(["postStats", postId]);

    //optimistically update both properties in one call
    queryClient.setQueryData<PostStats>(["postStats", postId], (old) => {
      if (!old) {
        return {
          ...postStats,
          liked: !hasLiked,
          likesCount: hasLiked ? Math.max(0, likesCount - 1) : likesCount + 1,
        };
      }

      return {
        ...old,
        liked: !hasLiked,
        likesCount: hasLiked
          ? Math.max(0, old.likesCount - 1)
          : old.likesCount + 1,
      };
    });

    if (hasLiked) {
      //unlike mutation
      unlikePostMutation(postId, {
        onError: () => {
          queryClient.setQueryData(["postStats", postId], previousStats);
        },
      });
    } else {
      //like mutation
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
      className={` cursor-pointer flex items-center gap-1 ${
        hasLiked ? "text-pink-600" : "text-gray-300"
      }`}
    >
      {hasLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
      <span className="text-xs">{likesCount}</span>
    </button>
  );
}