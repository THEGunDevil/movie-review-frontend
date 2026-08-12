"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Info, Check, AlertCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import axios from "axios";
import { toast } from "sonner";
import { SignUpData } from "@/models/user";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpData>({
    defaultValues: {
      user_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirm_password", "");

  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One number", valid: /\d/.test(password) },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
  ];

  const allRulesValid = rules.every((rule) => rule.valid);

  const onSubmit = async (data: SignUpData) => {
    setSubmitting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          user_name: data.user_name,
          email: data.email,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      toast.success("Signing Up! Redirecting...", {
        position: "top-center",
      });
      router.push("/authentication/signin");
      setTimeout(() => {
        toast.success("Account created successfully!", {
          position: "top-center",
        });
      }, 1000);
    } catch (error: any) {
      console.error(
        "❌ Registration failed:",
        error.response?.data || error.message,
      );
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* ── Headings ── */}
      <p className="font-mono text-[10px] tracking-[0.2em] text-amber-400/70 uppercase mb-2">
        🍿 Join the Community
      </p>
      <h2 className="font-mono text-2xl font-bold text-slate-100 mb-1">
        Create your Framewise account
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Start rating and reviewing films.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="username"
            className="font-mono text-xs text-slate-400"
          >
            Username
          </Label>
          <Input
            id="username"
            placeholder="JaneDoe"
            {...register("user_name", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 30,
                message: "Username must be less than 30 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Only letters, numbers, and underscores allowed",
              },
            })}
            className={`bg-slate-900/60 border-slate-700/60 text-slate-200 font-mono text-sm ${
              errors.user_name ? "border-rose-500/50 focus:border-rose-500" : ""
            }`}
          />
          {errors.user_name && (
            <p className="font-mono text-[10px] text-rose-400 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3 h-3" />
              {errors.user_name.message}
            </p>
          )}
        </div>

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
          <Label
            htmlFor="password"
            className="font-mono text-xs text-slate-400"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasNumber: (value) =>
                    /\d/.test(value) || "Must contain at least one number",
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Must contain at least one uppercase letter",
                },
              })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("confirmPassword")?.focus();
                }
              }}
              className={`bg-slate-900/60 border-slate-700/60 text-slate-200 font-mono text-sm pr-10 ${
                errors.password
                  ? "border-rose-500/50 focus:border-rose-500"
                  : ""
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

          {password.length > 0 && (
            <>
              <div className="space-y-1 pt-1">
                {rules.map((r) => (
                  <div key={r.label} className="flex items-center gap-1.5">
                    <Check
                      className={`w-3 h-3 transition-colors ${
                        r.valid ? "text-emerald-400" : "text-slate-700"
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] transition-colors ${
                        r.valid ? "text-emerald-400" : "text-slate-600"
                      }`}
                    >
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3].map((level) => {
                  const strength = rules.filter((r) => r.valid).length;
                  const isActive = strength >= level;
                  return (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        isActive
                          ? level === 1
                            ? "bg-rose-400"
                            : level === 2
                              ? "bg-yellow-400"
                              : "bg-emerald-400"
                          : "bg-slate-800"
                      }`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="font-mono text-xs text-slate-400"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirm_password", {
                // ✅ ঠিক নাম
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`bg-slate-900/60 border-slate-700/60 text-slate-200 font-mono text-sm pr-10 ${
                errors.confirm_password
                  ? "border-rose-500/50 focus:border-rose-500"
                  : confirmPassword.length > 0 && confirmPassword === password
                    ? "border-emerald-500/50 focus:border-emerald-500"
                    : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="font-mono text-[10px] text-rose-400 flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3 h-3" />
              {errors.confirm_password.message}
            </p>
          )}
          {confirmPassword.length > 0 && confirmPassword === password && (
            <p className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5 mt-1">
              <Check className="w-3 h-3" />
              Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={
            submitting ||
            (password.length > 0 && !allRulesValid) ||
            confirmPassword !== password
          }
          className="w-full bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400/25 font-mono text-sm uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account…
            </span>
          ) : (
            "Create Account"
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
        Already have an account?{" "}
        <Link
          href="/authentication/signin"
          className="text-amber-400 hover:text-amber-300 font-medium"
        >
          Sign in
        </Link>
      </p>

      <div className="flex items-start gap-2 mt-6 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5">
        <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
        <p className="font-mono text-[10px] text-slate-500 leading-relaxed">
          Your reviews are safe with us. We never share your data.
        </p>
      </div>
    </AuthLayout>
  );
}
