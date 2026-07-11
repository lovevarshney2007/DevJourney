// ─── Domain Types ──────────────────────────────────────────────────────────────
export type Domain =
  | "Backend"
  | "Frontend"
  | "AI/ML"
  | "Cloud Computing"
  | "App Development"
  | "Cyber Security"
  | "UI/UX"
  | "Others";

export const ALL_DOMAINS: Domain[] = [
  "Backend",
  "Frontend",
  "AI/ML",
  "Cloud Computing",
  "App Development",
  "Cyber Security",
  "UI/UX",
  "Others",
];

export const DOMAIN_COLORS: Record<Domain, string> = {
  Backend: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Frontend: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "AI/ML": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "Cloud Computing": "bg-sky-500/10 text-sky-400 border-sky-500/30",
  "App Development": "bg-green-500/10 text-green-400 border-green-500/30",
  "Cyber Security": "bg-red-500/10 text-red-400 border-red-500/30",
  "UI/UX": "bg-pink-500/10 text-pink-400 border-pink-500/30",
  Others: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

// ─── User Types ────────────────────────────────────────────────────────────────
export type UserRole = "student" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  studentNumber?: string;
  role: UserRole;
  avatar?: string;
  github?: string;
  linkedin?: string;
  skills: string[];
  totalPoints: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends IUser {
  token?: string;
}

// ─── Task Types ────────────────────────────────────────────────────────────────
export type TaskStatus = "draft" | "published" | "archived";
export type ImportSource = "manual" | "excel" | "doc" | "pdf";

export interface TaskResource {
  title: string;
  url: string;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  domains: Domain[];
  status: TaskStatus;
  deadline: string;
  points: number;
  pdfUrl?: string;
  resources: TaskResource[];
  attachments: string[];
  importedFrom: ImportSource;
  createdBy: string | IUser;
  createdAt: string;
  updatedAt: string;
}

// ─── Submission Types ──────────────────────────────────────────────────────────
export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "changes_requested";

export interface ISubmission {
  _id: string;
  taskId: string | ITask;
  studentId: string | IUser;
  githubUrl: string;
  videoDriveUrl?: string;
  deployUrl?: string;
  description: string;
  notes?: string;
  files: string[];
  status: SubmissionStatus;
  isLate: boolean;
  submittedAt: string;
  resubmittedAt?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Review Types ──────────────────────────────────────────────────────────────
export interface IReview {
  _id: string;
  submissionId: string | ISubmission;
  reviewedBy: string | IUser;
  status: SubmissionStatus;
  feedback: string;
  pointsAwarded: number;
  reviewedAt: string;
}

// ─── Announcement Types ────────────────────────────────────────────────────────
export type AnnouncementType = "task" | "notice" | "deadline" | "update";

export interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  createdBy: string | IUser;
  createdAt: string;
}

// ─── API Response Types ────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Dashboard Types ───────────────────────────────────────────────────────────
export interface StudentDashboardData {
  activeTasks: number;
  pendingReviews: number;
  upcomingDeadlines: ITask[];
  recentSubmissions: ISubmission[];
  announcements: IAnnouncement[];
}

export interface AdminDashboardData {
  totalStudents: number;
  totalTasks: number;
  pendingReviews: number;
  recentSubmissions: ISubmission[];
  topStudents: IUser[];
}

// ─── Import Types ──────────────────────────────────────────────────────────────
export interface ImportedTask {
  title: string;
  description: string;
  domains: Domain[];
  deadline: string;
  points: number;
  resources: TaskResource[];
}

export interface ImportPreview {
  tasks: ImportedTask[];
  errors: string[];
  source: ImportSource;
}
