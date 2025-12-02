"use client";
import Image from "next/image";
import React from "react";
import { FaRegCommentDots, FaRegTrashAlt } from "react-icons/fa";
import { useDeleteComment, useInfiniteComments } from "../../../custom-hooks/useComment";
import moment from "moment";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import CommentSkeleton from "@/components/skeletons/CommentSkeleton";

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

  const handleDelete = (commentId: string) => {
    if (!confirm("Are you sure you want to delete comment?")) {
      return;
    }

    deleteCommentMutation({ commentId, postId }, {
      onSuccess: () => {
        toast("Comment deleted successfully", {
          style: {
            background: "#5D5FEF",
            color: "white",
          },
        });
      },
    });
  };

  if (isLoading) return <CommentSkeleton />;
  if (isError) return <p className="text-gray-300">{error.message}</p>;

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mb-10 py-5 px-4">
        <div className="text-gray-400 mb-4">
          <FaRegCommentDots size={50} />
        </div>
        <h3 className="text-xl font-semibold text-gray-300">No comments yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          This post doesn&apos;t have any comments yet. Start the conversation
          by adding the first comment!
        </p>
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => {
        return (
          <div key={comment.id} className="bg-dark-3 p-4 rounded-2xl my-6">
            <div className="flex gap-2 items-center">
              <div className="relative w-10 h-10">
                <Image
                  src={comment.author.image || "/images/avatar.png"}
                  fill
                  alt="profile-pic"
                  className="object-cover rounded-full border-4 border-dark-4"
                />
              </div>
              <div>
                <p>{comment.author.name}</p>
                <div>
                  <span className="mr-2 text-sm font-normal text-gray-500">
                    @{comment.author.username}
                  </span>
                  <span className="text-primary text-sm font-semibold">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
              </div>
            </div>

            <p className="py-4 text-gray-200 text-sm">{comment.content}</p>

            <div className="mt-4 mx-1 flex gap-6">
              {userId === comment.author.id && (
                <button
                  aria-label="Delete comment"
                  disabled={isPending}
                  onClick={() => handleDelete(comment.id)}
                  className="text-gray-300 cursor-pointer flex items-center gap-1"
                >
                  <FaRegTrashAlt size={20} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {hasNextPage && (
        <div className="flex justify-center mb-10">
          <button
            className="bg-primary text-white py-2 px-4 rounded-full cursor-pointer"
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
