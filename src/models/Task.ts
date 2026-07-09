import mongoose, { Document, Schema } from "mongoose";
import { ALL_DOMAINS, Domain, TaskStatus, ImportSource } from "@/types";

export interface ITaskDocument extends Document {
  title: string;
  description: string;
  domains: Domain[];
  status: TaskStatus;
  deadline: Date;
  points: number;
  pdfUrl?: string;
  resources: { title: string; url: string }[];
  attachments: string[];
  importedFrom: ImportSource;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10,
    },
    domains: {
      type: [String],
      enum: ALL_DOMAINS,
      required: [true, "At least one domain is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one domain is required",
      },
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    points: {
      type: Number,
      required: [true, "Points are required"],
      min: 1,
      max: 1000,
    },
    pdfUrl: { type: String },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    attachments: [{ type: String }],
    importedFrom: {
      type: String,
      enum: ["manual", "excel", "doc", "pdf"],
      default: "manual",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

TaskSchema.index({ status: 1, deadline: 1 });
TaskSchema.index({ domains: 1 });

const Task =
  mongoose.models.Task || mongoose.model<ITaskDocument>("Task", TaskSchema);

export default Task;
