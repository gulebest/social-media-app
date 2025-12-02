import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unFollowUser } from "../services/follow";

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      authUserId,
      userId,
    }: {
      authUserId: string;
      userId: string;
      username: string;
    }) => followUser({ userId, authUserId }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["followSuggestions"] }),
        queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
        queryClient.invalidateQueries({
          queryKey: ["userDetails", variables.username],
        });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId }: { userId: string; username: string }) =>
      unFollowUser(userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
        queryClient.invalidateQueries({
          queryKey: ["userDetails", variables.username],
        });
    },
  });
}