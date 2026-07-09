"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, Eye, EyeOff, ArrowRight, Info } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerSchema, RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const studentNumber = watch("studentNumber");

  const onSubmit = async (data: RegisterInput) => {
    try {
      await axios.post("/api/auth/register", data);
      toast.success("Account created! Welcome to DevJourney.");
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 hero-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Code2 className="h-6 w-6 text-accent" />
            </div>
            <span className="font-bold text-xl text-text-primary">DevJourney</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-text-muted text-sm mt-1.5">
            Join DevJourney with your AKGEC email
          </p>
        </div>

        {/* Email hint */}
        <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-accent/5 border border-accent/20 mb-5">
          <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Your email must be in the format{" "}
            <span className="text-accent font-mono">
              {studentNumber
                ? `yourname${studentNumber}@akgec.ac.in`
                : "yourname25XXXXX@akgec.ac.in"}
            </span>
            {" "}— it must contain your student number.
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Love Varshney"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Student Number"
              placeholder="2510084"
              maxLength={7}
              error={errors.studentNumber?.message}
              hint="7 digits starting with 25 (e.g. 2510084)"
              {...register("studentNumber")}
            />

            <Input
              label="AKGEC Email"
              type="email"
              placeholder={studentNumber ? `yourname${studentNumber}@akgec.ac.in` : "yourname25XXXXX@akgec.ac.in"}
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="flex flex-col gap-1.5">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
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
              Create account
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
