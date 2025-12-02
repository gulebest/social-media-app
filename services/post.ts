import axios from "axios";
import { PostsResponse, PostStats } from "../types/post";

export async function createPost(data: FormData) {
  try {
    const response = await axios.post("/api/posts", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting post:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to delete post");
    } else {
      throw error;
    }
  }
}

export async function getPosts({ pageParam = 1 }): Promise<PostsResponse> {
  try {
    const response = await axios.get(`/api/posts?page=${pageParam}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch posts");
    } else {
      throw error;
    }
  }
}

export async function deletePost(postId: string) {
  try {
    const response = await axios.delete(`/api/posts/delete/${postId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting post:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to delete post");
    } else {
      throw error;
    }
  }
}

export async function getPostStats(postId: string): Promise<PostStats> {
  try {
    const response = await axios.get(`/api/posts/stats/${postId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting post:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to delete post");
    } else {
      throw error;
    }
  }
}


export async function getLikedPosts({pageParam = 1}) : Promise<PostsResponse>{
  try {
    const response = await axios.get(`/api/posts/liked-posts?page=${pageParam}`);
    return response.data;   
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting post:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to delete post");
    } else {
      throw error;
    }    
  }
}