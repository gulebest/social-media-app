import axios from "axios";
import { createNotification } from "./notification";

type FollowData = {
  userId: string;
  authUserId: string;
};

export async function followUser({ userId, authUserId }: FollowData) {
  try {
    const response = await axios.post(`/api/users/follow/${userId}`);
    const data = response.data;

    if (data.success) {
      if (authUserId !== userId) {
        createNotification({
          type: "follow",
          receiverId: userId,
          senderId: authUserId,
        });
      }
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error following user:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to follow user");
    } else {
      throw error;
    }
  }
}

export async function unFollowUser(userId: string) {
  try {
    const response = await axios.delete(`/api/users/follow/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error following user:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to follow user");
    } else {
      throw error;
    }
  }
}