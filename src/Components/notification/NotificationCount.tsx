import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { pusherClient } from "../../../lib/pusher";
import { useQueryClient } from "@tanstack/react-query";

export default function NotificationCount() {
  const [notificationCount, setNotificationCount] = useState(0);
  const session = useSession();
  const userId = session.data?.user?.id;
  const queryClient = useQueryClient();

  //fetch initial unread notification count
  useEffect(() => {
    if (!userId) return;

    const fetchInitialCount = async () => {
      try {
        const response = await axios.get("/api/notifications/unread-count");
        setNotificationCount(response.data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch notification count:", error);
      }
    };

    fetchInitialCount();
  }, [userId]);

  //listen for pusher updates
  useEffect(() => {
    if(!userId) return;

    const channel = pusherClient.subscribe(`user-${userId}`);
    channel.bind("notification-count-update",
        (data:{unreadCount:number}) => {
            setNotificationCount(data.unreadCount);
            queryClient.invalidateQueries({queryKey:["notifications"]})
        }
    );

    //return a cleanup
    return () => {
        channel.unbind_all();
        channel.unsubscribe();
    }
  },[userId,queryClient])

  if (notificationCount === 0) return null;
  return (
    <div className="absolute -top-3 -right-3 text-xs bg-pink-700 w-5 h-5 rounded-full font-semibold grid place-items-center text-white">
      {notificationCount}
    </div>
  );
}