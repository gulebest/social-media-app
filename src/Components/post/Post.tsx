import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Post as PostType } from "../../../types/post";
import moment from "moment";
import PostActions from "./PostActions";

type PostComponentProps = {
  post: PostType;
  userId: string;
};

export default function Post({ post, userId }: PostComponentProps) {
  return (
    <div className="bg-dark-3 p-4 rounded-2xl my-6">
      <div className="flex gap-2 items-center">
        <div className="relative w-10 h-10">
          <Image
            src={post.author.image || "/images/avatar.png"}
            fill
            alt="profile-pic"
            className="object-cover rounded-full border-4 border-dark-4"
          />
        </div>
        <div>
          <p>{post.author.name}</p>
          <div>
            <span className="mr-2 text-sm font-normal text-gray-500">
              @{post.author.username}
            </span>
            <span className="text-primary text-sm font-semibold">
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <Link href={`/post/${post.id}`}>
        {post.text && <p className="py-4 text-gray-200 text-sm">{post.text}</p>}
        {post.image && (
          <div className="relative w-full h-80 sm:h-100 md:h-120">
            <Image
              src={post.image}
              alt="profile-pic"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        )}
      </Link>
      <PostActions
        userId={userId}
        creatorId={post.author.id}
        postId={post.id}
        postViewPage={false}
      />
    </div>
  );
}