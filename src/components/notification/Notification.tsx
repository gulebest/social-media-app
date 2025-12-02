import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Notification as NotificationType } from "../../../types/notification";
import moment from "moment";
import { useMarkAllNotificationsAsRead } from "../../../custom-hooks/useNotification";

export default function Notification({
  notification,
}: {
  notification: NotificationType;
}) {

   const {mutate:markAllnotificationAsReadMutation} = useMarkAllNotificationsAsRead();

  useEffect(() => {
    markAllnotificationAsReadMutation();
  },[markAllnotificationAsReadMutation]);

    const truncateText = (text:string,maxLength:number = 100) => {
        if(!text) return;
        if(text.length <= maxLength) return text;
        return text.substring(0,maxLength) + "...";
    }
  return (
    <div className="flex items-center justify-between p-4 bg-dark-2 hover:bg-dark-3 rounded-xl transition my-3">
      <div className="flex items-center gap-3">
        <Link
          href={`/users/${notification.sender.username}`}
          className="w-10 h-10 rounded-full overflow-hidden relative"
        >
          <Image
            src={notification.sender.image || "/images/avatar.png"}
            alt="profile-pic"
            fill
            className="object-cover"
          />
        </Link>

        <div>
          <p className={`text-gray-200 text-sm ${notification.isRead ? "" : "font-bold"}`}>
            <span>{notification.message}</span>
          </p>
          {notification.post?.text && (
             <Link  href={`/post/${notification.post.id}`} className={`text-gray-400 text-sm hover:underline ${notification.isRead ? "" : "font-bold"}`}> {truncateText(notification.post.text,60)}  </Link>
          )}
         
          <p className="text-xs text-gray-500 mt-1">{ moment(notification.createdAt).fromNow() }</p>
        </div>
      </div>

      {notification.post?.image && (
         <Link href={`/post/${notification.post.id}`} className="w-10 h-10 rounded-lg bg-dark-4 overflow-hidden relative">
        <Image
          src={notification.post.image}
          alt="profile-pic"
          fill
          className="object-cover"
        />
      </Link>
      )}
     
    </div>
  );
}