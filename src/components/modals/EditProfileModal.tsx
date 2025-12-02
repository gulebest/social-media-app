import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { User } from "../../../types/user";
import axios from "axios";
import { toast } from "react-toastify";
import { useUpdateUser } from "../../../custom-hooks/useUser";

const EditProfileSchema = z.object({
  email: z.email("Invalid email address!"),
  name: z.string().min(2, "Name is required!"),
  username: z.string().min(3, "Username must be at least 3 characters!"),
  bio: z.string().optional().or(z.literal("")),
  image: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(
          files[0].type
        ),
      "Only .jpg, .png, or .webp images are allowed"
    ),
});

type EditProfileForm = z.infer<typeof EditProfileSchema>;

type EditProfileModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | undefined;
};

export default function EditProfileModal({
  setIsModalOpen,
  isModalOpen,
  user,
}: EditProfileModalProps) {
  const { mutate: updateUserMutation, isPending } = useUpdateUser();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (data: EditProfileForm) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("bio", data?.bio || "");
      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      updateUserMutation(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast("Profile updated successfully", {
            style: {
              background: "#5D5FEF",
              color: "white",
            },
          });
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast("Failed to update profile", {
          style: {
            background: "#9810fa",
            color: "white",
          },
        });
      }
    }
  };
  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-dark-2 w-[90%] max-w-md rounded-2xl p-6 relative shadow-xl">
            {/* form */}
            <form className="my-10" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-gray-400">Full name</label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full py-3 px-4 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-gray-400">Email address</label>
                <input
                  {...register("email")}
                  type="text"
                  className="w-full py-3 px-4 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-gray-400">Username</label>
                <input
                  {...register("username")}
                  type="text"
                  className="w-full py-3 px-4 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-gray-400">Bio</label>
                <textarea
                  {...register("bio")}
                  className="w-full py-3 px-4 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3 resize-none"
                ></textarea>
                {errors.bio && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.bio.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-gray-400">Profile picture</label>
                <input
                  {...register("image")}
                  type="file"
                  className="w-full py-3 px-4 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.image.message as string}
                  </p>
                )}
              </div>
              <div className="flex justify-end mt-4 gap-3">
                {/* close button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-dark-4 text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-full bg-primary hover:bg-primary/80 text-white cursor-pointer">
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}