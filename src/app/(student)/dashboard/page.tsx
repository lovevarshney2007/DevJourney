"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ClipboardList,
  Clock,
  Send,
  Megaphone,
  ArrowRight,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { StatCard, EmptyState, Skeleton, SectionCard, PageHeader } from "@/components/ui/Common";
import { StatusBadge, DomainBadge, AnnouncementTypeBadge } from "@/components/ui/Badges";
import { formatDate, formatRelative, isDeadlineSoon, isDeadlinePassed } from "@/lib/utils";
import { ITask, ISubmission, IAnnouncement } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardData {
  activeTasks: ITask[];
  mySubmissions: ISubmission[];
  announcements: IAnnouncement[];
}

export default function StudentDashboardPage() {
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", "published"],
    queryFn: () => axios.get("/api/tasks?status=published&limit=5").then((r) => r.data.data as ITask[]),
  });

  const { data: submissions, isLoading: subsLoading } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: () => axios.get("/api/submissions?limit=5").then((r) => r.data.data as ISubmission[]),
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => axios.get("/api/announcements?limit=5").then((r) => r.data.data as IAnnouncement[]),
  });

  const activeTasks = tasks?.filter((t) => !isDeadlinePassed(t.deadline)) || [];
  const pendingReviews = submissions?.filter((s) => s.status === "pending")?.length || 0;
  const upcomingDeadlines = tasks?.filter((t) => isDeadlineSoon(t.deadline)) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Active Tasks",
            value: tasksLoading ? "—" : activeTasks.length,
            icon: <ClipboardList className="h-5 w-5" />,
            description: "Available to submit",
            accentColor: "text-blue-400",
          },
          {
            title: "Pending Reviews",
            value: subsLoading ? "—" : pendingReviews,
            icon: <Clock className="h-5 w-5" />,
            description: "Awaiting admin review",
            accentColor: "text-yellow-400",
          },
          {
            title: "My Submissions",
            value: subsLoading ? "—" : submissions?.length || 0,
            icon: <Send className="h-5 w-5" />,
            description: "Total submissions",
            accentColor: "text-green-400",
          },
          {
            title: "Deadlines Soon",
            value: upcomingDeadlines.length,
            icon: <CalendarDays className="h-5 w-5" />,
            description: "Within 3 days",
            accentColor: "text-orange-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Active Tasks"
            actions={
              <Link href="/tasks" className="btn-ghost btn-sm">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {tasksLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : activeTasks.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="h-8 w-8" />}
                title="No active tasks"
                description="Check back later for new tasks from the CCC team."
              />
            ) : (
              <div className="space-y-3">
                {activeTasks.slice(0, 5).map((task) => (
                  <Link
                    key={task._id}
                    href={`/tasks/${task._id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-bg-hover border border-border hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {task.domains.slice(0, 2).map((d) => (
                          <DomainBadge key={d} domain={d} size="sm" />
                        ))}
                        <span
                          className={cn(
                            "text-[11px]",
                            isDeadlineSoon(task.deadline) ? "text-warning" : "text-text-muted"
                          )}
                        >
                          Due {formatDate(task.deadline)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-accent">{task.points}pts</span>
                      <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Submissions */}
          <SectionCard
            title="Recent Submissions"
            actions={
              <Link href="/submissions" className="btn-ghost btn-sm">
                View all
              </Link>
            }
          >
            {subsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : !submissions?.length ? (
              <p className="text-sm text-text-muted py-4 text-center">No submissions yet</p>
            ) : (
              <div className="space-y-2.5">
                {submissions.slice(0, 4).map((sub) => {
                  const task = sub.taskId as ITask;
                  return (
                    <Link
                      key={sub._id}
                      href={`/submissions/${sub._id}`}
                      className="block p-3 rounded-xl bg-bg-hover border border-border hover:border-accent/20 transition-colors"
                    >
                      <p className="text-xs font-medium text-text-primary truncate">
                        {typeof task === "object" ? task.title : "Task"}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <StatusBadge status={sub.status} isLate={sub.isLate} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Announcements */}
          <SectionCard title="Announcements">
            {!announcements?.length ? (
              <p className="text-sm text-text-muted py-4 text-center">No announcements</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map((ann) => (
                  <div key={ann._id} className="p-3 rounded-xl bg-bg-hover border border-border">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-medium text-text-primary flex-1">{ann.title}</p>
                      <AnnouncementTypeBadge type={ann.type} />
                    </div>
                    <p className="text-[11px] text-text-muted">{formatRelative(ann.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
