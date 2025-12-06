import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPost,
  deletePost,
  getLikedPosts,
  getPosts,
  getPostStats,
} from "../services/post";

// ---------------------------
// CREATE POST
// ---------------------------
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
    },
  });
}

// ---------------------------
// INFINITE POSTS (FEED)
// ---------------------------
export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
  });
}

// ---------------------------
// DELETE POST
// ---------------------------
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
    },
  });
}

// ---------------------------
// POST STATS (like count, comments count, liked)
// ---------------------------
export function usePostStats(postId: string) {
  return useQuery({
    queryKey: ["postStats", postId],
    queryFn: () => getPostStats(postId),
    enabled: !!postId,

    // 🔥 Prevent overwriting optimistic like state
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });
}

// ---------------------------
// INFINITE LIKED POSTS
// ---------------------------
export function useGetLikedPosts() {
  return useInfiniteQuery({
    queryKey: ["liked-posts"],
    queryFn: ({ pageParam = 1 }) => getLikedPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
  });
}
