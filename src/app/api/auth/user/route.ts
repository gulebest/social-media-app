import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../../../lib/prisma";
import {
  CloudinaryUploadResult,
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../../../../services/cloudinary";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        createdAt: true,
        bio: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    //get the fields
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string | null;
    const image = formData.get("image") as File | null;

    if (!name || !username || !email) {
      return NextResponse.json(
        { error: "Name, email, and username are required" },
        { status: 400 }
      );
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "Email already taken" },
          { status: 409 }
        );
      }
    }

    //check if username has already
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    //uploading the users profile picture

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true, imagePublicId: true },
    });

    let imageData: CloudinaryUploadResult | null = null;
    if (image && image.size > 0) {
      // handle the image upload
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image must be less than 5MB" },
          { status: 400 }
        );
      }

      const allowedTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
          { status: 400 }
        );
      }

      try {
        imageData = await uploadToCloudinary(image);

        //delete the old image
        if (currentUser?.imagePublicId) {
          try {
            await deleteFromCloudinary(currentUser.imagePublicId);
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError);
          }
        }
      } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    //update the user in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        username,
        bio: bio || null,
        ...(imageData && {
          image: imageData.secure_url,
          imagePublicId: imageData.public_id,
        }),
      },
    });

    return NextResponse.json(
      { success: true, message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}