export type NotificationData = {
  type: "like" | "comment" | "follow";
  receiverId: string;
  senderId: string;
  postId?: string;
};

export type Notification = {
  id: string;
  type: "like" | "comment" | "follow";
  message: string | null;
  isRead: boolean;
  createdAt: string;
  receiverId: string;
  postId?: string;
  sender: {
    id: string;
    image: string | null;
    username:string
  };
  post?: {
    id: string;
    text: string | null;
    image: string | null;
  };  
}