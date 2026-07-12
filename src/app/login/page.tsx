"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, PhoneCall } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, LoginInput } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      const user = res.data.data;
      toast.success(`Welcome back, ${user.name}!`);
      router.push(user.role?.toLowerCase() === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-bg-wash-violet to-bg-wash-mint opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-border-hairline bg-transparent">
              <Image src="/images/ccclogo.png" alt="CCC Logo" fill className="object-contain p-0.5" priority />
            </div>
            <span className="font-bold text-xl text-text-primary">DevJourney</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-muted text-sm mt-1.5">
            Sign in to your CCC AKGEC account
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="AKGEC Email"
              type="email"
              placeholder="love2510084@akgec.ac.in"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="flex flex-col gap-1.5">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`input pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="w-full"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border-hairline text-center">
            <p className="text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-accent-violet hover:text-accent-mint font-medium transition-colors">
                Create one
              </Link>
            </p>

            <div className="mt-6 pt-5 border-t border-border-hairline/50 text-left">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Facing Issues?</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Love Varshney</span>
                  <a href="tel:9720028781" className="text-accent-violet hover:text-accent-mint font-medium flex items-center gap-1.5 transition-colors">
                    <PhoneCall className="h-3.5 w-3.5" /> +91 97200 28781
                  </a>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Ayush Pratap</span>
                  <a href="tel:9236243578" className="text-accent-violet hover:text-accent-mint font-medium flex items-center gap-1.5 transition-colors">
                    <PhoneCall className="h-3.5 w-3.5" /> +91 92362 43578
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Only AKGEC students with <span className="text-text-secondary">@akgec.ac.in</span> emails can register.
        </p>
      </motion.div>
    </div>
  );
}
