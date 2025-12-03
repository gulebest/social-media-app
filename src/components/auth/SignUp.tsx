"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { TiSocialInstagramCircular } from "react-icons/ti";
import z from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required!"),
  email: z.email("Invalid email address!"),
  username: z.string().min(3, "Username must be at least 3 characters!"),
  password: z.string().min(6, "Password must be at least 6 characters!"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function SignupComponent() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await axios.post("/api/auth/register", data);

      if (res.status === 201) {
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (!res.error) {
          reset();
          router.replace("/home");
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError("root", {
          message: error.response?.data.error || "Something went wrong",
        });
      }
    }
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[320px] w-[90%]">
        {/* logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <TiSocialInstagramCircular size={40} color="#5D5FEF" />
          <span className="text-3xl font-semibold tracking-wide text-gray-400">
            Momentify
          </span>
        </div>
        {/* heading */}
        <h2 className="text-center text-3xl font-semibold mb-3 text-gray-200">
          Create a new account
        </h2>
        <p className="text-gray-500 text-center text-sm">
          To use circle, Please enter your details
        </p>

        {/* form */}
        <form className="my-10" onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <p className="bg-primary py-2 text-center text-white">
              {errors.root.message}
            </p>
          )}
          <input
            {...register("name")}
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
          )}
          <input
            {...register("email")}
            type="text"
            placeholder="Email Address"
            className="w-full px-4 py-3 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
          )}
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mb-2">
              {errors.username.message}
            </p>
          )}
          <input
            {...register("password")}
            type="text"
            placeholder="Password"
            className="w-full px-4 py-3 placeholder-text-gray-400 bg-dark-3 rounded-lg outline-none text-gray-100 my-3"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">
              {errors.password.message}
            </p>
          )}
          <button
            disabled={isSubmitting}
            className="bg-primary w-full my-2 py-2 text-white rounded-lg cursor-pointer"
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="my-3 text-center text-white">
          <span>Already have an account?</span>
          <Link href="/" className="ml-2 text-primary">
            Signin
          </Link>
        </div>
      </div>
    </div>
  );
}