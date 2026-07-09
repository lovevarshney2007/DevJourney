import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  studentNumber?: string;
  role: "student" | "admin";
  avatar?: string;
  github?: string;
  linkedin?: string;
  skills: string[];
  totalPoints: number;
  completedTasks: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => v.endsWith("@akgec.ac.in"),
        message: "Email must be an AKGEC email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    studentNumber: {
      type: String,
      sparse: true,
      validate: {
        validator: (v: string) => /^25\d{5}$/.test(v),
        message: "Student number must be 7 digits starting with 25",
      },
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    avatar: { type: String },
    github: { type: String },
    linkedin: { type: String },
    skills: [{ type: String, maxlength: 50 }],
    totalPoints: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
