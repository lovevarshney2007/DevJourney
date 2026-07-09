import mongoose, { Document, Schema } from "mongoose";
import { SubmissionStatus } from "@/types";

export interface IReviewDocument extends Document {
  submissionId: mongoose.Types.ObjectId;
  reviewedBy: mongoose.Types.ObjectId;
  status: SubmissionStatus;
  feedback: string;
  pointsAwarded: number;
  reviewedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
      required: true,
      unique: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "rejected", "changes_requested"],
      required: true,
    },
    feedback: {
      type: String,
      required: [true, "Feedback is required"],
      minlength: 5,
      maxlength: 5000,
    },
    pointsAwarded: {
      type: Number,
      required: true,
      min: 0,
      max: 1000,
    },
    reviewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Review =
  mongoose.models.Review ||
  mongoose.model<IReviewDocument>("Review", ReviewSchema);

export default Review;
