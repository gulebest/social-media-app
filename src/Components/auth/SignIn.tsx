"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { TiSocialInstagramCircular } from "react-icons/ti";
import z from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email address!"),
  password: z.string().min(6, "Password must be at least 6 characters!"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SigninComponent() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result.error) {
      setError("root", {
        message: "Invalid Credentials",
      });
    } else {
      reset();
      router.replace("/home");
    }
  };
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[320px] w-[90%]">
        {/* logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <TiSocialInstagramCircular size={40} color="#5D5FEF" />
          <span className="text-3xl font-semibold tracking-wide text-gray-400">
            Circle
          </span>
        </div>
        {/* heading */}
        <h2 className="text-center text-3xl font-semibold mb-3 text-gray-200">
          Signin to your account
        </h2>
        <p className="text-gray-500 text-center text-sm">
          To use circle, Please enter your details
        </p>

        {/* form */}
        <form className="my-10"onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <p className="bg-primary py-2 text-center text-white">
              {errors.root.message}
            </p>
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
          <button className="bg-primary w-full my-2 py-2 text-white rounded-lg cursor-pointer">
            Sign in
          </button>
        </form>

        <div className="my-3 text-center text-white">
          <span>Don&apos;t have an account?</span>
          <Link href="/signup" className="ml-2 text-primary">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}