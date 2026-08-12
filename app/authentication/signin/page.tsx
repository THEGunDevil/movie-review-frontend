"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Info, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { SignInData } from "@/models/user";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInData) => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      toast.success("Signing In! Redirecting...", {
        position: "top-center",
      });
      login(response.data.access_token);
      router.push("/");
      setTimeout(() => {
        toast.success("Signed In successfully!", {
          position: "top-center",
        });
      }, 1000);
    } catch (error: any) {
      console.error("❌ Signing in failed:", error.response?.data || error.message);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signing in failed. Please check your credentials.";

      toast.error(errorMessage, {
        position: "bottom-center",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* ── Headings ── */}
      <p className="font-mono text-[10px] tracking-[0.2em] text-amber-400/70 uppercase mb-2">
        🎬 Welcome Back
      </p>
      <h2 className="font-mono text-2xl font-bold text-slate-100 mb-1">
        Sign in to Framewise
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Continue your film journey.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-mono text-xs text-slate-400">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className={`bg-slate-900/60 border-slate-700/60 text-slate-200 font-mono text-sm ${
              errors.email ? "border-rose-500/50 focus:border-rose-500" : ""
            }`}
          />
          {errors.email && (
            <p className="font-mono text-[10px] text-rose-400 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="font-mono text-xs text-slate-400">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="font-mono text-[11px] text-amber-400/70 hover:text-amber-400 transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`bg-slate-900/60 border-slate-700/60 text-slate-200 font-mono text-sm pr-10 ${
                errors.password ? "border-rose-500/50 focus:border-rose-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="font-mono text-[10px] text-rose-400 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400/25 font-mono text-sm uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="font-mono text-[10px] text-slate-600 uppercase">
          or continue with
        </span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* <OAuthButtons /> */}

      <p className="text-center text-sm text-slate-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/authentication/signup"
          className="text-amber-400 hover:text-amber-300 font-medium"
        >
          Sign up
        </Link>
      </p>

      <div className="flex items-start gap-2 mt-6 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5">
        <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
        <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
          Portfolio demo — this form creates a real account for film reviews.
        </p>
      </div>
    </AuthLayout>
  );
}