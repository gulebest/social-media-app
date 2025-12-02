"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { IoMdPhotos } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { RxCross2 } from "react-icons/rx";
import { useCreatePost } from "../../../custom-hooks/usePost";
import { useGetUser } from "../../../custom-hooks/useUser";

export default function CreatePostInput() {
  const [imagePreview, setImagePreview] = useState<null | string>(null);
  const [postImage, setPostImage] = useState<null | File>(null);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const fileRef = useRef<null | HTMLInputElement>(null);
  const { mutate: createPostMutation, isPending } = useCreatePost();
  const { isLoading, data: user } = useGetUser();

  const onEmojiClick = (emojidata: EmojiClickData) => {
    setText((prev) => prev + emojidata.emoji);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
    setPostImage(null);
  };

  const handleCreatePost = () => {
    if (!text.trim() && !postImage) {
      return;
    }

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (postImage) formData.append("image", postImage);

    createPostMutation(formData, {
      onSuccess: () => {
        setText("");
        setImagePreview(null);
        setPostImage(null);
      },
      onError: (error) => {
        console.log("Failed to create post:", error.message);
      },
    });
  };

  return (
    <div
      className={`bg-dark-3 p-4 rounded-2xl ${isPending ? "opacity-60" : ""}`}
    >
      {showPicker && (
        <div className="fixed z-10 top-60 left-1/2 w-[90%] max-w-2xl -translate-x-1/2">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={onEmojiClick}
            style={{
              width: "100%",
              background: "black",
            }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative w-12 h-12 shrink-0">
          {isLoading ? (
            <div className="animate-pulse rounded-full w-12 h-12 bg-dark-4"></div>
          ) : (
            <Image
              src={user?.image || "/images/profile.jpg"}
              alt="profile-pic"
              fill
              className="object-cover rounded-full border-4 border-dark-4"
            />
          )}
        </div>

        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="bg-dark-2 w-full p-2 rounded-2xl outline-none resize-none"
          />

          {imagePreview && (
            <div className="h-60 md:h-100 rounded-2xl overflow-hidden my-5 relative">
              <Image
                src={imagePreview}
                alt="preview-image"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <button
                onClick={removeImage}
                aria-label="Remove image"
                className="absolute top-5 right-5 bg-gray-600 w-10 h-10 text-2xl rounded-full opacity-50 cursor-pointer grid place-items-center"
              >
                <RxCross2 />
              </button>
            </div>
          )}

          <div className="mt-2 flex gap-4">
            {/* Photo button */}
            <button
              onClick={() => fileRef.current?.click()}
              aria-label="Upload photo"
              className="text-green-700 flex items-center gap-2 bg-dark-2 px-4 py-2 rounded-xl cursor-pointer"
            >
              <IoMdPhotos size={20} />
              <span className="text-sm text-gray-400">Photo</span>
            </button>

            {/* File input with label */}
            <label htmlFor="postImage" className="hidden">
              Upload image
            </label>
            <input
              id="postImage"
              type="file"
              accept="images/*"
              ref={fileRef}
              aria-label="Upload image"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Emoji button */}
            <button
              onClick={() => setShowPicker(!showPicker)}
              aria-label="Toggle emoji picker"
              className="text-yellow-800 flex items-center gap-2 bg-dark-2 px-4 py-2 rounded-xl cursor-pointer"
            >
              <MdOutlineEmojiEmotions size={20} />
              <span className="text-sm text-gray-400">Emoji</span>
            </button>

            {/* Post button */}
            <button
              disabled={isPending}
              onClick={handleCreatePost}
              aria-label="Create post"
              className={`text-blue-700 flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer ${
                text.trim().length > 0 || postImage ? "bg-dark-2" : "bg-dark-4"
              }`}
            >
              <BsFillSendFill size={20} />
              <span className="text-sm text-gray-400">
                {isPending ? "Posting..." : "Post"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
