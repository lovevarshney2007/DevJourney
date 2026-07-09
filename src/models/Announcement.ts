import mongoose, { Document, Schema } from "mongoose";
import { AnnouncementType } from "@/types";

export interface IAnnouncementDocument extends Document {
  title: string;
  content: string;
  type: AnnouncementType;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncementDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: 10,
      maxlength: 10000,
    },
    type: {
      type: String,
      enum: ["task", "notice", "deadline", "update"],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ createdAt: -1 });

const Announcement =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncementDocument>("Announcement", AnnouncementSchema);

export default Announcement;
