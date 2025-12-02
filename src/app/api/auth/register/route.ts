import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").toLowerCase().trim();
    const password = body.password ?? "";
    const name = body.name ?? "";
    const username = body.username ?? "";

    //basic server validation
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    //chech for existing users by email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    //hashpassword
    const hashedPassword = await hash(password,10);

    //create a new user
    await prisma.user.create({
      data:{
        name,
        email,
        username,
        password:hashedPassword
      }
    });

      return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}