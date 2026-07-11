"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Info, MailCheck, ArrowLeft } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerSchema, RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [step1Data, setStep1Data] = useState<Partial<RegisterInput>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const studentNumber = watch("studentNumber");
  const name = watch("name");

  useEffect(() => {
    if (name && studentNumber) {
      const cleanName = name.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const generatedEmail = `${cleanName}${studentNumber}@akgec.ac.in`;
      setValue("email", generatedEmail, { shouldValidate: true });
    }
  }, [name, studentNumber, setValue]);

  const onSendOtp = async (data: RegisterInput) => {
    setStep1Data(data);
    setIsSendingOtp(true);
    setOtpError("");
    try {
      const res = await axios.post("/api/auth/send-otp", { email: data.email });
      
      if (res.data.message && res.data.message.includes("Email failed")) {
        toast.error("Could not send email. Check backend terminal for OTP.");
      } else {
        toast.success("Verification code sent to your email!");
      }
      
      setStep(2);
    } catch (err: any) {
      console.error("Send OTP Error:", err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Failed to send verification code");
      } else {
        toast.error(err.message || "An unexpected error occurred");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onVerifyAndRegister = async (data: RegisterInput) => {
    if (!data.otp) {
      setOtpError("Please enter the 6-digit code");
      return;
    }
    
    const finalData = { ...step1Data, otp: data.otp };
    
    try {
      await axios.post("/api/auth/register", finalData);
      toast.success("Account created! Welcome to DevJourney.");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Register API Error:", err.response?.data || err.message);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Registration failed");
      } else {
        toast.error("Registration failed");
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
            <div className="relative h-10 w-10 rounded-xl overflow-hidden ring-2 ring-accent/30 bg-bg-hover">
              <Image src="/images/ccclogo.png" alt="CCC Logo" fill className="object-contain p-0.5" priority />
            </div>
            <span className="font-bold text-xl text-text-primary">DevJourney</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">
            {step === 1 ? "Create your account" : "Verify your email"}
          </h1>
          <p className="text-text-muted text-sm mt-1.5">
            {step === 1 ? "Join DevJourney with your AKGEC email" : "We sent a 6-digit code to your email"}
          </p>
        </div>

        {step === 1 && (
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-accent/5 border border-accent/20 mb-5">
            <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary leading-relaxed">
              Your email will be automatically generated from your first name and student number.
            </p>
          </div>
        )}

        <div className="card">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit(onSendOtp)} 
                className="space-y-4"
              >
                <Input
                  label="Full Name"
                  placeholder="Love Varshney"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <Input
                  label="Student Number"
                  placeholder="2510084"
                  maxLength={8}
                  error={errors.studentNumber?.message}
                  hint="7 or 8 digits (e.g. 2510084)"
                  {...register("studentNumber")}
                />

                <Input
                  label="AKGEC Email"
                  type="email"
                  placeholder={studentNumber ? `yourname${studentNumber}@akgec.ac.in` : "yourname25XXXXX@akgec.ac.in"}
                  error={errors.email?.message}
                  readOnly
                  className="bg-accent/5 opacity-80"
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
                  loading={isSendingOtp}
                  className="w-full"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Send Verification Code
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit(onVerifyAndRegister)} 
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <div className="h-16 w-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MailCheck className="h-8 w-8 text-accent" />
                  </div>
                  <p className="text-sm text-text-secondary mb-1">Enter the verification code sent to:</p>
                  <p className="text-sm font-medium text-text-primary">{getValues("email")}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Input
                    label="Verification Code"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono py-3"
                    error={otpError || errors.otp?.message}
                    {...register("otp")}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    className="flex-[2]"
                  >
                    Verify & Register
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

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
