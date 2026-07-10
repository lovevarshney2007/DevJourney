import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { registerSchema, validateEmailStudentNumberMatch } from "@/lib/validations";
import User from "@/models/User";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, studentNumber, password, otp } = parsed.data;

    if (!otp) {
      return NextResponse.json(
        { success: false, error: "OTP is required for registration" },
        { status: 400 }
      );
    }

    // Verify OTP from Redis
    const storedOtp = await redis.get(`otp:${email.toLowerCase()}`);
    if (!storedOtp) {
      return NextResponse.json(
        { success: false, error: "OTP has expired or was not requested. Please request a new one." },
        { status: 400 }
      );
    }
    if (String(storedOtp) !== otp) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP code" },
        { status: 400 }
      );
    }

    // Cross-field validation: email must contain student number
    if (!validateEmailStudentNumberMatch(email, studentNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: `Email must contain your student number (${studentNumber}). Expected format: yourname${studentNumber}@akgec.ac.in`,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Check if student number is taken
    const existingStudentNum = await User.findOne({ studentNumber });
    if (existingStudentNum) {
      return NextResponse.json(
        { success: false, error: "This student number is already registered" },
        { status: 409 }
      );
    }

    const user = await User.create({
      name,
      email,
      studentNumber,
      password,
      role: "student",
    });

    // Delete OTP from Redis after successful registration
    await redis.del(`otp:${email.toLowerCase()}`);

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          studentNumber: user.studentNumber,
          role: user.role,
        },
        message: "Account created successfully",
      },
      { status: 201 }
    );

    response.cookies.set("devjourney_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
