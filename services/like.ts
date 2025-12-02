import axios from "axios";
import { createNotification } from "./notification";

interface LikeData {
  postId: string;
  userId: string;
}

export async function likePost(likeData: LikeData) {
  try {
    const response = await axios.post(`/api/like/${likeData.postId}`);
    const data = response.data;
    if(data.success && data.postAuthorId){
      if(data.postAuthorId !== likeData.userId){
        createNotification({
          type:"like",
          receiverId:data.postAuthorId,
          senderId:likeData.userId,
          postId:likeData.postId
        })
      }
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error liking post:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to like post");
    } else {
      throw error;
    }
  }
}

export async function unLikePost(postId: string) {
  try {
    const response = await axios.delete(`/api/like/${postId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error liking post:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to like post");
    } else {
      throw error;
    }
  }
}