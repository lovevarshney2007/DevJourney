import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isPast, isWithinInterval, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isDeadlinePassed(deadline: string | Date): boolean {
  return isPast(new Date(deadline));
}

export function isDeadlineSoon(deadline: string | Date): boolean {
  const d = new Date(deadline);
  return !isPast(d) && isWithinInterval(d, { start: new Date(), end: addDays(new Date(), 3) });
}

export function formatDeadline(deadline: string | Date): {
  label: string;
  variant: "danger" | "warning" | "default";
} {
  const d = new Date(deadline);
  if (isPast(d)) {
    return { label: "Deadline passed", variant: "danger" };
  }
  if (isWithinInterval(d, { start: new Date(), end: addDays(new Date(), 3) })) {
    return { label: `Due ${formatRelative(d)}`, variant: "warning" };
  }
  return { label: `Due ${formatDate(d)}`, variant: "default" };
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getSubmissionStatusConfig(status: string): {
  label: string;
  color: string;
  bg: string;
} {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    pending: {
      label: "Pending Review",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
    },
    approved: {
      label: "Approved",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    rejected: {
      label: "Rejected",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
    changes_requested: {
      label: "Changes Requested",
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
  };
  return map[status] || map.pending;
}

export function getTaskStatusConfig(status: string): {
  label: string;
  color: string;
  bg: string;
} {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    draft: {
      label: "Draft",
      color: "text-gray-400",
      bg: "bg-gray-500/10 border-gray-500/20",
    },
    published: {
      label: "Published",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    archived: {
      label: "Archived",
      color: "text-gray-500",
      bg: "bg-gray-600/10 border-gray-600/20",
    },
  };
  return map[status] || map.draft;
}

export function buildApiUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}/api${path}`;
}
