import axios from "axios";
import { CommentsResponse, CreateCommentData } from "../types/comments";
import { createNotification } from "./notification";

export async function createComment(commentData: CreateCommentData) {
  try {
    const response = await axios.post("/api/comments", commentData);

    const data = response.data;

     if(data.success && data.postAuthorId){
          if(data.postAuthorId !== commentData.userId){
            createNotification({
              type:"comment",
              receiverId:data.postAuthorId,
              senderId:commentData.userId,
              postId:commentData.postId
            })
          }
        }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating comment:", error.response?.data);
      throw new Error(
        error.response?.data?.error || "Failed to create comment"
      );
    } else {
      throw error;
    }
  }
}

export async function getComments({
  pageParam,
  postId,
}: {
  pageParam?: number;
  postId: string;
}): Promise<CommentsResponse> {
  try {
    const response = await axios.get(
      `/api/comments?page=${pageParam}&postId=${postId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch comments"
      );
    } else {
      throw error;
    }
  }
}



export async function deleteComment(commentId: string) {
  try {
    const response = await axios.delete(`/api/comments/delete/${commentId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error deleting comment:", error.response?.data);
      throw new Error(
        error.response?.data?.error || "Failed to delete comment"
      );
    } else {
      throw error;
    }
  }
}