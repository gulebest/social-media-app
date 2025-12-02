"use client";
import Notification from "@/components/notification/Notification";
import React from "react";
import { useGetNotifications } from "../../../../custom-hooks/useNotification";
import { MdNotificationsActive } from "react-icons/md";
import NotificationsSkeleton from "@/components/skeletons/NotificationsSkeleton";

export default function NotificationsPage() {
  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useGetNotifications();
 
  

  if (isLoading) return <NotificationsSkeleton/>;
  if (isError) return <p className="text-gray-300">{error.message}</p>;

  if (notifications?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 bg-dark-2 p-4 rounded-2xl">
        <div className="text-gray-400 mb-4">
          <MdNotificationsActive size={50} />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
        <p className="text-gray-600">
          You don&apos;t have any notifications yet. Your notifications will be
          displayed here.
        </p>
      </div>
    );
  }
  return (
    <>
      {notifications?.map((notification) => {
        return (
          <Notification key={notification.id} notification={notification} />
        );
      })}
    </>
  );
}