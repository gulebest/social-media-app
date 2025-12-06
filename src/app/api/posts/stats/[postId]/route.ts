import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "../../../../../../lib/prisma";
export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();
    const postId = params.postId;

    const likes = await prisma.like.count({
      where: { postId },
    });

    const comments = await prisma.comment.count({
      where: { postId },
    });

    const userLiked = session?.user?.id
      ? await prisma.like.findFirst({
          where: { postId, userId: session.user.id },
        })
      : null;

    return NextResponse.json({
      likes,
      comments,
      userLiked: !!userLiked,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
