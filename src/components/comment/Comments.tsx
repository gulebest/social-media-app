"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDeleteComment, useInfiniteComments } from "../../../custom-hooks/useComment";
import moment from "moment";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import CommentSkeleton from "@/components/skeletons/CommentSkeleton";
import Link from "next/link";

export default function Comments({ postId }: { postId: string }) {
  const session = useSession();
  const userId = session.data?.user?.id;

  const { mutate: deleteCommentMutation, isPending } = useDeleteComment();
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteComments(postId);

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const handleDelete = (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    deleteCommentMutation(
      { commentId, postId },
      {
        onSuccess: () => {
          toast("Comment deleted successfully", {
            style: { background: "#5D5FEF", color: "white" },
          });
        },
      }
    );
  };

  // Reply input (no need for parentId if unused)
  const ReplyInput = () => {
    return (
      <div className="mt-2 ml-12">
        <input
          type="text"
          placeholder="Write a reply..."
          className="w-full p-2 rounded-md bg-dark-2 text-gray-200 border border-dark-4"
        />
      </div>
    );
  };

  if (isLoading) return <CommentSkeleton />;
  if (isError) return <p className="text-gray-300">{error.message}</p>;

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mb-10 py-5 px-4">
        <div className="text-gray-400 mb-4">
          <FaRegTrashAlt size={50} />
        </div>
        <h3 className="text-xl font-semibold text-gray-300">No comments yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          This post doesn&apos;t have any comments yet. Start the conversation by adding the first comment!
        </p>
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-dark-3 p-4 rounded-2xl my-4">
          <div className="flex gap-3 items-start">
            <Link
              href={`/profile/${comment.author.username}`}
              className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden cursor-pointer"
            >
              <Image
                src={comment.author.image || "/images/avatar.png"}
                fill
                alt="profile-pic"
                className="object-cover rounded-full border-2 border-dark-4"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${comment.author.username}`}
                  className="font-semibold text-gray-100 hover:underline"
                >
                  {comment.author.name}
                </Link>
                <span className="text-gray-500 text-sm">@{comment.author.username}</span>
                <span className="text-primary text-sm font-semibold ml-auto">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>

              <p className="py-2 text-gray-200 text-sm whitespace-pre-wrap">{comment.content}</p>

              <div className="flex items-center gap-6 text-gray-400 text-sm select-none">
                <button
                  onClick={() =>
                    setReplyingToId((prev) => (prev === comment.id ? null : comment.id))
                  }
                  className="hover:text-primary cursor-pointer"
                >
                  Reply
                </button>

                {userId === comment.author.id && (
                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(comment.id)}
                    className="hover:text-red-500 cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>

              {replyingToId === comment.id && <ReplyInput />}
            </div>
          </div>
        </div>
      ))}

      {hasNextPage && (
        <div className="flex justify-center mb-10">
          <button
            className="bg-primary text-white py-2 px-6 rounded-full cursor-pointer"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
