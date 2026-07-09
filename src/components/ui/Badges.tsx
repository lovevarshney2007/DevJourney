"use client";

import { cn } from "@/lib/utils";
import { DOMAIN_COLORS, Domain } from "@/types";

interface DomainBadgeProps {
  domain: Domain;
  size?: "sm" | "md";
}

export function DomainBadge({ domain, size = "md" }: DomainBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        DOMAIN_COLORS[domain]
      )}
    >
      {domain}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  isLate?: boolean;
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending Review", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  approved: { label: "Approved", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
  rejected: { label: "Rejected", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  changes_requested: { label: "Changes Requested", cls: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  draft: { label: "Draft", cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  published: { label: "Published", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  archived: { label: "Archived", cls: "bg-gray-600/10 text-gray-500 border-gray-600/20" },
};

export function StatusBadge({ status, isLate }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className={cn("badge", config.cls)}>
      {config.label}
      {isLate && (
        <span className="ml-1 text-[10px] text-orange-400 font-semibold">• LATE</span>
      )}
    </span>
  );
}

interface AnnouncementTypeBadgeProps {
  type: string;
}

const ANNOUNCEMENT_MAP: Record<string, { label: string; cls: string }> = {
  task: { label: "New Task", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  notice: { label: "Notice", cls: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  deadline: { label: "Deadline", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  update: { label: "Update", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
};

export function AnnouncementTypeBadge({ type }: AnnouncementTypeBadgeProps) {
  const config = ANNOUNCEMENT_MAP[type] || ANNOUNCEMENT_MAP.notice;
  return <span className={cn("badge", config.cls)}>{config.label}</span>;
}
