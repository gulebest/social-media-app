import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

interface RegisterRequestBody {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequestBody = await req.json();
    const { fullName, username, email, password } = body;

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Sign up failed" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { fullName, username, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Sign up failed" },
      { status: 500 }
    );
  }
}
