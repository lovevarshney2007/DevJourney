"use client";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover border border-border flex-shrink-0",
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        "bg-gradient-to-br from-accent to-purple-500 text-white",
        sizeMap[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

// Stat Card for dashboards
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: "up" | "down" | "neutral";
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  accentColor = "text-accent",
}: StatCardProps) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
          {description && (
            <p className="text-xs text-text-muted mt-1">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "p-2.5 rounded-xl bg-bg-hover border border-border group-hover:border-accent/30 transition-colors",
            accentColor
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// Page header
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {description && (
          <p className="text-text-muted text-sm mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// Empty state
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 rounded-2xl bg-bg-hover border border-border text-text-muted mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-text-muted text-sm max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Loading skeleton
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

// Section card wrapper
export function SectionCard({
  title,
  children,
  actions,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h2 className="text-base font-semibold text-text-primary">
              {title}
            </h2>
          )}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
