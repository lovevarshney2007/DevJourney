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
        "badge",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "",
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
  pending: { label: "Pending Review", cls: "badge-yellow" },
  approved: { label: "Approved", cls: "badge-green" },
  rejected: { label: "Rejected", cls: "badge-red" },
  changes_requested: { label: "Changes Req", cls: "badge-orange" },
  draft: { label: "Draft", cls: "badge-gray" },
  published: { label: "Published", cls: "badge-blue" },
  archived: { label: "Archived", cls: "badge-gray" },
};

export function StatusBadge({ status, isLate }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className={cn(config.cls, isLate && "border-red-500")}>
      {config.label}
      {isLate && (
        <span className="ml-1 text-danger font-bold uppercase">• LATE</span>
      )}
    </span>
  );
}

interface AnnouncementTypeBadgeProps {
  type: string;
}

const ANNOUNCEMENT_MAP: Record<string, { label: string; cls: string }> = {
  task: { label: "New Task", cls: "badge-blue" },
  notice: { label: "Notice", cls: "badge-yellow" },
  deadline: { label: "Deadline", cls: "badge-red" },
  update: { label: "Update", cls: "badge-green" },
};

export function AnnouncementTypeBadge({ type }: AnnouncementTypeBadgeProps) {
  const config = ANNOUNCEMENT_MAP[type] || ANNOUNCEMENT_MAP.notice;
  return <span className={cn(config.cls)}>{config.label}</span>;
}
