import axios from "axios";
import { Notification, NotificationData } from "../types/notification";

export function createNotification(notificationData: NotificationData) {
  axios
    .post(`/api/notifications`, notificationData, {
      timeout: 7000,
    })
    .catch((error) => {
      console.log("Error creating notification:", error);
    });
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await axios.get("/api/notifications");
    return response.data.notifications;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch notifications"
      );
    } else {
      throw error;
    }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const response = await axios.patch("/api/notifications");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to mark all notifications as read"
      );
    } else {
      throw error;
    }
  }
}