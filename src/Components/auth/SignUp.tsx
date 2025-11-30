"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiSocialInstagramCircular } from "react-icons/ti";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpInput = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      await axios.post("/api/auth/register", data);

      // Automatically sign in after successful registration
      const loginRes = await axios.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (loginRes.status === 200) {
        // Redirect to dashboard or home page
        router.push("/home"); // adjust this route as needed
      } else {
        setSuccessMessage(
          "Account created successfully! Please sign in manually."
        );
        reset();
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setServerError("Sign up failed: Email or username already exists.");
      } else {
        setServerError("Sign up failed. Please try again.");
      }
      setTimeout(() => setServerError(null), 3000);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[var(--color-dark-1)] px-4">
      <div className="w-full max-w-sm bg-[var(--color-dark-2)] rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <TiSocialInstagramCircular size={40} color="#5D5FEF" />
          <span className="text-3xl font-semibold tracking-wide text-gray-300">
            Circle
          </span>
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-100 mb-2">
          Create a new account
        </h2>
        <p className="text-center text-gray-400 mb-6 text-sm">
          To use Circle, please enter your details
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mx-auto w-full max-w-[260px]"
        >
          <input
            type="text"
            placeholder="Full Name"
            {...register("fullName")}
            className="w-full mb-2 px-4 py-4 rounded-lg bg-[var(--color-dark-3)] 
                       text-gray-100 placeholder-gray-500 border border-white/10 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition shadow-sm hover:shadow-md"
          />
          <p className="text-red-500 text-sm mb-2">{errors.fullName?.message}</p>

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full mb-2 px-4 py-4 rounded-lg bg-[var(--color-dark-3)] 
                       text-gray-100 placeholder-gray-500 border border-white/10 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition shadow-sm hover:shadow-md"
          />
          <p className="text-red-500 text-sm mb-2">{errors.email?.message}</p>

          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className="w-full mb-2 px-4 py-4 rounded-lg bg-[var(--color-dark-3)] 
                       text-gray-100 placeholder-gray-500 border border-white/10 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition shadow-sm hover:shadow-md"
          />
          <p className="text-red-500 text-sm mb-2">{errors.username?.message}</p>

          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full mb-2 px-4 py-4 rounded-lg bg-[var(--color-dark-3)] 
                       text-gray-100 placeholder-gray-500 border border-white/10 
                       focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                       outline-none transition shadow-sm hover:shadow-md"
          />
          <p className="text-red-500 text-sm mb-2">{errors.password?.message}</p>

          {serverError && (
            <p className="text-red-500 text-sm mb-2">{serverError}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm mb-2">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 
                       transition text-white text-lg shadow-md hover:shadow-lg"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="my-4 text-center text-gray-300 text-sm">
          <span>Already have an account? </span>
          <Link
            href="/signin"
            className="ml-2 text-blue-500 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-white/20" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <hr className="flex-grow border-white/20" />
        </div>

        <div className="flex justify-center gap-4">
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-gray-100 w-[120px] shadow-sm hover:shadow-md">
            <FcGoogle size={20} /> Google
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-gray-100 w-[120px] shadow-sm hover:shadow-md">
            <TiSocialInstagramCircular size={20} color="#5D5FEF" /> Instagram
          </button>
        </div>
      </div>
    </div>
  );
}
