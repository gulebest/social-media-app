"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { TiSocialInstagramCircular } from "react-icons/ti";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../../src/app/globals.css";

// Validation schema
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInInputs = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInputs) => {
    setServerError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setServerError("Invalid email or password.");
      setTimeout(() => setServerError(null), 5000);
      return;
    }

    reset();
    router.push("/home"); // redirect after successful login
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[var(--color-dark-1)] px-4">
      <div className="w-full max-w-sm bg-[var(--color-dark-2)] rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <TiSocialInstagramCircular size={40} color="#5D5FEF" />
          <span className="text-3xl font-semibold tracking-wide text-gray-300">Circle</span>
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-100 mb-2">Sign In</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          Welcome back! Please enter your credentials
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mx-auto w-full max-w-[260px]"
        >
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full mb-2 px-4 py-3 rounded-lg bg-[var(--color-dark-3)]
                       text-gray-100 placeholder-gray-500 border border-white/10
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                       outline-none transition shadow-sm hover:shadow-md"
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full mb-2 px-4 py-3 rounded-lg bg-[var(--color-dark-3)]
                       text-gray-100 placeholder-gray-500 border border-white/10
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                       outline-none transition shadow-sm hover:shadow-md"
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

          {serverError && <p className="text-red-500 text-sm mb-2">{serverError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700
                       transition text-white text-lg shadow-md hover:shadow-lg"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="my-4 text-center text-gray-300 text-sm">
          <span>Don't have an account? </span>
          <Link href="/signup" className="ml-2 text-blue-500 hover:underline font-medium">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
