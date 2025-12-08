import React from "react";
import Feed from "@/components/post/Feed";
import { auth } from "../../../auth";
import CreatePostInput from "@/components/post/CreatePostInput";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="max-w-2xl gap-10 mx-auto p-4">

      {/* Post creation form */}
      {session?.user?.id && <CreatePostInput />}

      {/* Feed for logged-in users */}
      {session?.user?.id ? (
        <Feed userId={session.user.id} />
      ) : (
        <p className="text-gray-300 text-center mt-6">
          Please log in to see posts.
        </p>
      )}
    </div>
  );
}
