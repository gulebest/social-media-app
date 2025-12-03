import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import prisma from "../../../../../lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const me = session.user.id;

    const users = await prisma.user.findMany({
      where: {
        id: { not: me },

        // I DO NOT follow them
        followers: {
          none: { followerId: me },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,

        // They follow ME (follow back)
        following: {
          where: { followingId: me },
          select: { id: true },
        },
      },
      take: 20,
    });

    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      image: u.image,
      isFollowingBack: u.following.length > 0,  // they follow me
    }));

    const suggestions = formatted
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return NextResponse.json({ users: suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user suggestions" },
      { status: 500 }
    );
  }
}
