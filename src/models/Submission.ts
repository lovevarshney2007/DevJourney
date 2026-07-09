import mongoose, { Document, Schema } from "mongoose";
import { SubmissionStatus } from "@/types";

export interface ISubmissionDocument extends Document {
  taskId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  githubUrl: string;
  videoDriveUrl?: string;
  deployUrl?: string;
  description: string;
  notes?: string;
  files: string[];
  status: SubmissionStatus;
  isLate: boolean;
  submittedAt: Date;
  resubmittedAt?: Date;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmissionDocument>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    githubUrl: {
      type: String,
      required: [true, "GitHub URL is required"],
      validate: {
        validator: (v: string) => v.includes("github.com"),
        message: "Must be a valid GitHub URL",
      },
    },
    videoDriveUrl: { type: String },
    deployUrl: { type: String },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: 10,
      maxlength: 5000,
    },
    notes: { type: String, maxlength: 2000 },
    files: [{ type: String }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "changes_requested"],
      default: "pending",
    },
    isLate: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
    resubmittedAt: { type: Date },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Compound index: one submission per student per task
SubmissionSchema.index({ taskId: 1, studentId: 1 }, { unique: true });
SubmissionSchema.index({ status: 1, isLate: 1 });
SubmissionSchema.index({ studentId: 1, createdAt: -1 });

const Submission =
  mongoose.models.Submission ||
  mongoose.model<ISubmissionDocument>("Submission", SubmissionSchema);

export default Submission;
