import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers, getUserDetails } from "../services/users";

export function useFollowSuggestions() {
  return useQuery({
    queryFn: getSuggestedUsers,
    queryKey: ["followSuggestions"],
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserDetails(username: string) {
  return useQuery({
    queryFn: () => getUserDetails(username),
    queryKey: ["userDetails", username],
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}