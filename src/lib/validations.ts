import { z } from "zod";
import { ALL_DOMAINS } from "@/types";

// ─── Auth Schemas ──────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .endsWith("@akgec.ac.in", "Email must be an AKGEC email (@akgec.ac.in)")
    .toLowerCase(),
  studentNumber: z
    .string()
    .regex(/^25\d{5}$/, "Student number must be 7 digits and start with 25"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Cross-field validation: email must contain studentNumber
export function validateEmailStudentNumberMatch(
  email: string,
  studentNumber: string
): boolean {
  return email.toLowerCase().includes(studentNumber);
}

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Task Schemas ──────────────────────────────────────────────────────────────

export const taskResourceSchema = z.object({
  title: z.string().min(1, "Resource title is required"),
  url: z.string().url("Resource URL must be a valid URL"),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .trim(),
  domains: z
    .array(z.enum(ALL_DOMAINS as [string, ...string[]]))
    .min(1, "At least one domain is required"),
  deadline: z.string().min(1, "Deadline is required").refine((val) => !isNaN(Date.parse(val)), "Valid deadline is required"),
  points: z
    .number()
    .int()
    .min(1, "Points must be at least 1")
    .max(1000, "Points cannot exceed 1000"),
  pdfUrl: z.string().url().optional().or(z.literal("")),
  resources: z.array(taskResourceSchema).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

// ─── Submission Schemas ────────────────────────────────────────────────────────

export const createSubmissionSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  githubUrl: z
    .string()
    .url("GitHub URL must be valid")
    .includes("github.com", { message: "Must be a GitHub URL" }),
  videoDriveUrl: z
    .string()
    .url("Video URL must be valid")
    .optional()
    .or(z.literal("")),
  deployUrl: z
    .string()
    .url("Deploy URL must be valid")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000),
  notes: z.string().max(2000).optional(),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

// ─── Review Schemas ────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  status: z.enum(["approved", "rejected", "changes_requested"]),
  feedback: z
    .string()
    .min(5, "Feedback must be at least 5 characters")
    .max(5000),
  pointsAwarded: z.number().int().min(0).max(1000),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// ─── Announcement Schemas ──────────────────────────────────────────────────────

export const createAnnouncementSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  content: z.string().min(10).max(10000).trim(),
  type: z.enum(["task", "notice", "deadline", "update"]),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

// ─── Profile Schemas ───────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string().max(50)).max(20).optional(),
  avatar: z.string().url().optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
