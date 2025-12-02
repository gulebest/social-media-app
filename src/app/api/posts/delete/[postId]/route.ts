import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import prisma from "../../../../../../lib/prisma";
import { deleteFromCloudinary } from "../../../../../../services/cloudinary";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    //type validation
    if (!postId || typeof postId !== "string") {
      return NextResponse.json(
        { error: "Valid post ID is required" },
        { status: 400 }
      );
    }

    //check for authorization
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, imagePublicId: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own posts" },
        { status: 403 }
      );
    }

    //delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    if (post.imagePublicId) {
      await deleteFromCloudinary(post.imagePublicId);
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);

    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}