import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createPost, deletePost, getLikedPosts, getPosts, getPostStats } from "../services/post";

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createPost(data),
    onSuccess: () => {
      //invalidate the post query
      queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
    },
  });
}

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite"],
    queryFn: getPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      //return the nextpage number if there are more pages alse we return undefinded
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    retry: 1,
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
    },
  });
}

export function usePostStats(postId:string){
  return useQuery({
    queryFn:() => getPostStats(postId),
    queryKey:["postStats",postId],
    enabled:!!postId
  })
}

export function useGetLikedPosts(){
  return useInfiniteQuery({
    queryKey:["liked-posts"],
    queryFn:getLikedPosts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      //return the nextpage number if there are more pages alse we return undefinded
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    retry: 1,    
  })
}