import axios from "axios";
import { User } from "../types/user";

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await axios.get("/api/auth/user");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || "Failed to fetch user");
    } else {
      throw new Error("Network error occured");
    }
  }
}

export async function updateUser(data: FormData) {
  try {
    const response = await axios.patch("/api/auth/user", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update user");
    } else {
      throw new Error("Failed to update user");
    }
  }
}