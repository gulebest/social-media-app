import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "../../../../../../lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    //fetch all poststats in parallel
    const [likeStatus, likesCount, commentsCount] = await Promise.all([
      prisma.like.findFirst({
        where: {
          userId: session.user.id,
          postId,
        },
      }),
      prisma.like.count({
        where: { postId },
      }),
      prisma.comment.count({
        where: { postId },
      }),
    ]);

    return NextResponse.json({
      liked: !!likeStatus,
      likesCount,
      commentsCount,
    });
  } catch (error) {
    console.error("Error fetching post stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch post stats" },
      { status: 500 }
    );
  }
}