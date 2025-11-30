import React from "react";
import SignUp from "../../../Components/auth/SignUp";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function SignUpPage() {
  const session = await auth();
    if (!session) {
        redirect("/home");

    }
  return (
    <SignUp />
  );
}