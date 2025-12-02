import UserProfile from "@/components/users/UserProfile";
import React from "react";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
    const username = (await params).username;
  return <UserProfile username={username}/>
}