import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authUserId = session.user.id;

    // Find users that the logged-in user is NOT following
    const users = await prisma.user.findMany({
      where: {
        id: { not: authUserId }, // exclude logged-in user
        followers: {
          none: { followerId: authUserId }, // I am NOT following them
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        // Check if THEY follow ME -> Follow Back
        followers: {
          where: { followerId: authUserId },
          select: { id: true },
        },
      },
      take: 20,
    });

    // Add "isFollowingBack" flag
    const formatted = users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      image: u.image,
      isFollowingBack: u.followers.length > 0,
    }));

    // Shuffle list
    const shuffled = formatted.sort(() => 0.5 - Math.random());

    // Take 3 random suggestions
    const suggestions = shuffled.slice(0, 3);

    return NextResponse.json({ users: suggestions });
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user suggestions" },
      { status: 500 }
    );
  }
}
