import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"; // or "bcryptjs" if using bcryptjs
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { fullName, username, email, password } = await req.json();
   // basic server-side validation
    if (!fullName || !username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
// Check if user with the same email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email or username already in use" }, { status: 409 });
    }
// Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
// Create the new user
    const user = await prisma.user.create({
      data: { fullName, username, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created successfully", userId: user.id }, { status: 201 });
    // Note: In a real application, do not return the user object directly as it may contain sensitive information.
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
