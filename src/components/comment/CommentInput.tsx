"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useGetUser } from "../../../custom-hooks/useUser";
import { useSession } from "next-auth/react";
import { CreateCommentData } from "../../../types/comments";
import { useCreateComment } from "../../../custom-hooks/useComment";
import dynamic from "next/dynamic";

// Emoji Picker
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function CommentInput({ postId }: { postId: string }) {
  const { data: user, isLoading } = useGetUser();
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate: createCommentMutation, isPending } = useCreateComment();
  const session = useSession();
  const userId = session.data?.user?.id;

  // Auto-resize textarea like Instagram
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "32px";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [content]);

  // Submit comment
  const handleSubmit = () => {
    if (!userId || !content.trim()) return;

    const commentData: CreateCommentData = {
      userId,
      postId,
      content: content.trim(),
    };

    createCommentMutation(commentData, {
      onSuccess: () => {
        setContent("");
        setShowEmojiPicker(false);
      },
    });
  };

  return (
    <div className="bg-dark-3 px-4 py-3 rounded-2xl relative border border-dark-4/40">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {isLoading ? (
          <div className="w-10 h-10 rounded-full bg-dark-4 animate-pulse" />
        ) : (
          <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden">
            <Image
              src={user?.image || "/images/avatar.png"}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Comment Box */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={1}
            placeholder="Add a comment..."
            className="
              w-full bg-dark-2 text-gray-200
              rounded-2xl px-12 py-3 pr-14
              overflow-hidden resize-none outline-none
              border border-dark-4/40 placeholder-gray-500
            "
          />

          {/* Emoji button */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-gray-200 transition"
          >
            <MdOutlineEmojiEmotions size={22} />
          </button>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="
              absolute top-1/2 -translate-y-1/2 right-4
              text-blue-500 hover:text-blue-400 transition
              disabled:text-gray-600
            "
          >
            <BsSend size={20} />
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute left-0 bottom-full mb-2 z-50 animate-fade-in">
              <EmojiPicker
                onEmojiClick={(emojiData) =>
                  setContent((prev) => prev + emojiData.emoji)
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
