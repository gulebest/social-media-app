import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

interface RegisterRequestBody {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body: RegisterRequestBody = await req.json();

    const { fullName, username, email, password } = body;

    // Basic server-side validation
    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user with the same email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Sign up failed" }, // generic error for user
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: { fullName, username, email, password: hashedPassword },
    });

    console.log("New user registered:", { fullName, username, email });

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Sign up failed" }, // generic message
      { status: 500 }
    );
  }
}
