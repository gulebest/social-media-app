import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import prisma from "../../../../lib/prisma";
import { pusherServer } from "../../../../lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, receiverId, senderId, postId } = await req.json();

    //validate the required fields
    if (!senderId || !receiverId || !type) {
      return NextResponse.json(
        { error: "Type, receiverId, and senderId are required" },
        { status: 400 }
      );
    }

    //validate the notification type
    if (!["like", "comment", "follow"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      );
    }

    //verify if the reciver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Notification receiver not found" },
        { status: 404 }
      );
    }

    //verify if sender exists
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true },
    });

    if (!sender) {
      return NextResponse.json(
        { error: "Notification sender not found" },
        { status: 404 }
      );
    }

    //verify if post exists
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
    }

    let message = "";
    switch (type) {
      case "like":
        message = `${sender.name} liked your post`;
        break;
      case "comment":
        message = `${sender.name} commented on your post`;
        break;
      case "follow":
        message = `${sender.name} started following you`;
        break;
    }

    //check  for duplicate notifications
    if (type === "like" || type === "follow") {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          type,
          receiverId,
          senderId,
          postId: type === "like" ? postId : null,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), //last 24 hours
          },
        },
      });

      if (existingNotification) {
        return NextResponse.json({
          message: "Notification already exists",
          duplicate: true,
        });
      }
    }

    //create a new notification
    await prisma.notification.create({
      data: {
        type,
        message,
        receiverId,
        senderId,
        postId: postId || null,
      },
    });

    //get updated notification count
    const unreadCount = await prisma.notification.count({
      where: {
        receiverId,
        isRead: false,
      },
    });

    //trigger pusher event to the receiver
    await pusherServer.trigger(
      `user-${receiverId}`, // channel name
      `notification-count-update`, //event name
      {
        unreadCount,
        type: "new-notification",
      }
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Create notification error:", error);

    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            text: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const receiverId = session?.user?.id

    //mark all notifications as read
    await prisma.notification.updateMany({
      where: {
        receiverId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    //trigger a pusher event with updated count 0
     await pusherServer.trigger(
      `user-${receiverId}`, // channel name
      `notification-count-update`, //event name
      {
        unreadCount:0,
        type: "mark-all-as-read",
      }
    );
    

    return NextResponse.json({
      success: true,
      message: "All notification marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}