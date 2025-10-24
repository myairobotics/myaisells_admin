"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthResponse, BusinessResponse } from "@/types/auth";
import Input from "@/components/Atoms/Input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import axios from "axios";

type SignInData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>();
  const { setProfile } = useAuth();

  const onSubmit = async (data: SignInData) => {
    try {
      setLoading(true);
      const response = await axios.post<AuthResponse>(
        `https://demo.myairesource.us/api/v1/auth/login`,
        data
      );
      if (response.data?.token?.token) {
        sessionStorage.setItem("token", response.data.token.token);
        const resp = await axios.get<BusinessResponse>(
          `https://demo.myairesource.us/api/v1/businesses`,
          {
            headers: {
              Authorization: `Bearer ${response.data.token.token}`,
            },
          }
        );
        setProfile(resp.data[0]);
        router.push("/");
        toast.success(response.data.message || "Signed in successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to sign in");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FBFF]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/assets/logo.svg"
            alt="Logo"
            width={150}
            height={40}
            priority
          />
        </div>

        <h1 className="text-2xl font-bold text-left mb-6">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2 px-2">
            <label className="font-semibold text-[#8182A1] text-sm">
              Email
            </label>
            <Input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              validationError={errors.email?.message}
              isValid={!!errors.email}
              status={errors.email ? "error" : undefined}
            />
          </div>

          <div className="flex flex-col gap-2 px-2">
            <label className="font-semibold text-[#8182A1] text-sm">
              Password
            </label>
            <Input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              validationError={errors.password?.message}
              isValid={!!errors.password}
              status={errors.password ? "error" : undefined}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 px-4  text-white font-semibold
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#6998EF] hover:bg-[#6998EF]/90"
              }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
