// src/app/(auth)/signin/page.tsx
import React from "react";
import SignIn from "../../../Components/auth/SignIn";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function SignInPage() {
  const session = await auth();

  // redirect logged-in users to /home
  if (session) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <SignIn />
    </div>
  );
}
