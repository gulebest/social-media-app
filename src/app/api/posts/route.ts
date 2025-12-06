import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import prisma from "../../../../lib/prisma";

// GET POSTS (Home + Profile + Infinite Feed)
export async function GET(req: Request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = 8;
    const skip = (page - 1) * limit;

    // If viewing a profile: ?userId=xxxx
    const profileUserId = searchParams.get("userId");

    // Get current user followings
    let followingIds: string[] = [];

    if (session?.user?.id) {
      const follows = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      });

      followingIds = follows.map(f => f.followingId);
    }

    // BUILD FEED FILTER
    const where = profileUserId
      ? { authorId: profileUserId } // Profile posts
      : {
          OR: [
            { authorId: session?.user?.id ?? "" }, // My posts
            { authorId: { in: followingIds } }, // Followed users
          ],
        };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, username: true, image: true, name: true },
          },
          likes: true,
          comments: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),

      prisma.post.count({ where }),
    ]);

    // FORMAT RESPONSE FOR UI
    const formatted = posts.map(post => ({
      id: post.id,
      text: post.text,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,

      likesCount: post.likes.length,
      commentsCount: post.comments.length,

      isLiked: session?.user
        ? post.likes.some(l => l.userId === session.user.id)
        : false,
    }));

    return NextResponse.json({
      posts: formatted,
      pagination: {
        nextPage: page * limit < total ? page + 1 : null,
      },
    });
  } catch (error) {
    console.log("GET POSTS ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// CREATE POST
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const text = formData.get("text") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!text?.trim() && !imageFile)
      return NextResponse.json(
        { error: "Post must have text or image" },
        { status: 400 }
      );

    let imageUrl: string | null = null;

    if (imageFile) {
      const { uploadToCloudinary } = await import(
        "../../../../services/cloudinary"
      );
      const uploaded = await uploadToCloudinary(imageFile);
      imageUrl = uploaded.secure_url;
    }

    const post = await prisma.post.create({
      data: {
        text: text?.trim() || null,
        image: imageUrl,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
