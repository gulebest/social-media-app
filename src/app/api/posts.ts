import { Post } from "../../../types/post";

export type CreatePostInput = { text?: string | null; image?: File | null };

export async function createPost(input: CreatePostInput): Promise<Post> {
  const formData = new FormData();
  if (input.text) formData.append("text", input.text);
  if (input.image) formData.append("image", input.image);

  const res = await fetch("/api/posts", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Failed to create post");
  }

  const data = await res.json();
  return data.post as Post;
}
