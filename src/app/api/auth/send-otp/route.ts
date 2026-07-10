import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { redis } from "@/lib/redis";
import { sendOTP } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    // 2. Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in Redis with a 10-minute expiration (600 seconds)
    // Key format: otp:user@email.com
    await redis.setex(`otp:${email.toLowerCase()}`, 600, otp);

    // TEMPORARY FOR TESTING: Print OTP to terminal
    console.log("\n===========================================");
    console.log(`🔑 DEVJOURNEY OTP FOR ${email}: ${otp}`);
    console.log("===========================================\n");

    // 4. Send the OTP via Email
    const emailSent = await sendOTP(email, otp);

    if (!emailSent) {
      console.warn("⚠️ Warning: Failed to send OTP email, but OTP was generated and saved to Redis. You can use the OTP printed above for testing.");
    }

    return NextResponse.json({ 
      success: true, 
      message: emailSent ? "OTP sent successfully" : "OTP generated (Check terminal). Email failed." 
    });
  } catch (error) {
    console.error("[SEND OTP]", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
