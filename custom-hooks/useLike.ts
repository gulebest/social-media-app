import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unLikePost } from "../services/like";

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: (_data, variables) => {
      //invalidate some queries
      queryClient.invalidateQueries({
        queryKey: ["postStats", variables.postId],
      });
    },
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unLikePost,
    onSuccess: (_data, postId) => {
      //invalidate some queries
      queryClient.invalidateQueries({ queryKey: ["postStats", postId] });
    },
  });
}