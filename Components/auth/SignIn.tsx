// Components/auth/SignIn.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { TiSocialInstagramCircular } from "react-icons/ti";
import "../../src/app/globals.css"

// Zod schema for Sign In
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInInputs = z.infer<typeof signInSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInInputs) => {
    console.log("Sign In Data:", data);
    // TODO: send request to /api/auth/login
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[var(--color-dark-1)] px-4">
      <div className="w-full max-w-sm bg-[var(--color-dark-2)] rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <TiSocialInstagramCircular size={40} color="#5D5FEF" />
          <span className="text-3xl font-semibold tracking-wide text-gray-300">
            Circle
          </span>
        </div>

        {/* Header */}
        <h2 className="text-center text-3xl font-bold text-gray-100 mb-2">
          Sign In
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Welcome back! Please enter your credentials
        </p>

        {/* Form */}
        <form
          className="flex flex-col items-center mx-auto w-full max-w-[260px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[var(--color-dark-3)] 
                       text-gray-100 placeholder-gray-500 border border-white/10 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition shadow-sm hover:shadow-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full mb-6 px-4 py-3 rounded-lg bg-[var(--color-dark-3)] 
                       text-gray-100 placeholder-gray-500 border border-white/10 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition shadow-sm hover:shadow-md"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 
                       transition text-white text-lg shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="my-4 text-center text-gray-300 text-sm">
          <span>Don't have an account? </span>
          <Link href="/signup" className="ml-2 text-blue-500 hover:underline font-medium">
            Sign Up
          </Link>
        </div>

        {/* Or Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-white/20" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-white/20" />
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-gray-100 w-[120px] shadow-sm hover:shadow-md">
            <FcGoogle size={20} />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-gray-100 w-[120px] shadow-sm hover:shadow-md">
            <TiSocialInstagramCircular size={20} color="#5D5FEF" />
            Instagram
          </button>
        </div>

      </div>
    </div>
  );
}
