import prisma from "../lib/prisma";

export async function getPostByID(postId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
            id: true,
          },
        },
      },
    });

    if (!post) return null;

    return post;
  } catch (error) {
    console.error("Get post error:", error);
    return null;
  }
}
