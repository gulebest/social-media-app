import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "../../../../../../lib/prisma";

// IMPORTANT: params MUST be async in Next.js 15+
export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();

    // Await params to get postId
    const { postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Count likes
    const likesCount = await prisma.like.count({
      where: { postId },
    });

    // Count comments
    const commentsCount = await prisma.comment.count({
      where: { postId },
    });

    // Check if current user liked it
    const liked = session?.user?.id
      ? !!(await prisma.like.findFirst({
          where: { postId, userId: session.user.id },
        }))
      : false;

    // RETURN payload that matches frontend
    return NextResponse.json({
      likesCount,
      commentsCount,
      liked,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
