import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import {
  CloudinaryUploadResult,
  uploadToCloudinary,
} from "../../../../services/cloudinary";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const text = formData.get("text") as string | null;
    const imageFile = formData.get("image") as File | null;

    //validate required fields
    if (!text?.trim() && !imageFile) {
      return NextResponse.json(
        { error: "Post must have either text or image" },
        { status: 400 }
      );
    }

    let imageData: CloudinaryUploadResult | null = null;

    if (imageFile) {
      try {
        imageData = await uploadToCloudinary(imageFile);
      } catch (error) {
        console.error("image upload error:",error)
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    await prisma.post.create({
      data: {
        text: text?.trim() || null,
        authorId: session?.user?.id,
        ...(imageData && {
          image: imageData.secure_url,
          imagePublicId: imageData.public_id,
        }),
      },
    });

    return NextResponse.json(
      { success: true, message: "Post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 2; //2 posts per page;

    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      //fetch the posts
      prisma.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}