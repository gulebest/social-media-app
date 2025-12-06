import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { Post } from "../types/post";

// Define input type for creating a post
type NewPostInput = {
  text?: string;
  image?: string;
};

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, NewPostInput>({
    mutationFn: async (newPost: NewPostInput) => {
      const { data } = await axios.post("/api/posts", newPost);
      return data as Post;
    },
    onSuccess: (createdPost: Post) => {
      // Update the infinite feed query
      queryClient.setQueryData<{ pages: { posts: Post[] }[] } | undefined>(
        ["posts"], // make sure this key matches your useInfinitePosts query key
        (oldData) => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map((page, index) => {
            if (index === 0) {
              return { ...page, posts: [createdPost, ...page.posts] };
            }
            return page;
          });

          return { ...oldData, pages: newPages };
        }
      );
    },
  });
}
