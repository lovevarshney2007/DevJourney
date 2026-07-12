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
  PhoneCall
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
    queryFn: () => axios.get("/api/tasks?status=published&limit=5").then((r) => (r.data.data as ITask[]) || []),
    refetchInterval: 10000, // Real-time updates every 10 seconds
  });

  const { data: submissions, isLoading: subsLoading } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: () => axios.get("/api/submissions?limit=5").then((r) => (r.data.data as ISubmission[]) || []),
    refetchInterval: 10000,
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => axios.get("/api/announcements?limit=5").then((r) => (r.data.data as IAnnouncement[]) || []),
    refetchInterval: 30000, // Announcements don't change as often
  });

  const activeTasks = tasks?.filter((t) => !isDeadlinePassed(t.deadline)) || [];
  const pendingReviews = submissions?.filter((s) => s.status === "pending")?.length || 0;
  const upcomingDeadlines = tasks?.filter((t) => isDeadlineSoon(t.deadline)) || [];

  return (
    <div className="p-6 md:p-10 w-full max-w-[1500px] mx-auto min-h-screen">
      <PageHeader
        title={<>Student <span className="font-serif italic font-normal text-accent-violet">Dashboard</span></>}
        description="Welcome to the CCC task evaluation portal."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Active Tasks",
            value: tasksLoading ? "—" : activeTasks.length,
            icon: <ClipboardList className="h-6 w-6" />,
            description: "Available to submit",
            accentColor: "text-accent-violet",
          },
          {
            title: "Pending Reviews",
            value: subsLoading ? "—" : pendingReviews,
            icon: <Clock className="h-6 w-6" />,
            description: "Awaiting admin review",
            accentColor: "text-accent-mint",
          },
          {
            title: "My Submissions",
            value: subsLoading ? "—" : submissions?.length || 0,
            icon: <Send className="h-6 w-6" />,
            description: "Total submissions",
            accentColor: "text-accent-violet",
          },
          {
            title: "Deadlines Soon",
            value: upcomingDeadlines.length,
            icon: <CalendarDays className="h-6 w-6" />,
            description: "Within 3 days",
            accentColor: "text-accent-mint",
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Tasks */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Active Tasks"
            className="p-6 md:p-8"
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
                title="No active assignments"
                description="Check back later for new tasks from the Cloud Computing Cell."
              />
            ) : (
              <div className="space-y-4">
                {activeTasks.slice(0, 5).map((task, idx) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                  >
                    <Link
                      href={`/tasks/${task._id}`}
                      className="flex items-center justify-between p-5 rounded-xl bg-bg-surface border border-border-hairline hover:border-accent-violet/30 hover:bg-bg-wash-violet transition-all duration-200 group hover:shadow-sm"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-base font-semibold text-text-primary truncate group-hover:text-accent-violet transition-colors">
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
                        <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-accent-violet transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Recent Submissions */}
          <SectionCard
            title="Recent Submissions"
            className="p-6 md:p-8"
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
                {submissions.slice(0, 4).map((sub, idx) => {
                  const task = sub.taskId as ITask;
                  return (
                    <motion.div
                      key={sub._id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01, x: -4 }}
                    >
                      <Link
                        href={`/submissions/${sub._id}`}
                        className="block p-4 rounded-xl bg-bg-surface border border-border-hairline hover:border-accent-violet/20 hover:bg-bg-wash-violet transition-all duration-200"
                      >
                        <p className="text-xs font-medium text-text-primary truncate">
                          {task && typeof task === "object" ? task.title : "Deleted Task"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <StatusBadge status={sub.status} isLate={sub.isLate} />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Announcements */}
          <SectionCard title="Announcements" className="p-6 md:p-8">
            {!announcements?.length ? (
              <p className="text-sm text-text-muted py-4 text-center">No announcements</p>
            ) : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map((ann, idx) => (
                  <motion.div 
                    key={ann._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-bg-surface border border-border-hairline cursor-pointer hover:border-accent-mint/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-medium text-text-primary flex-1">{ann.title}</p>
                      <AnnouncementTypeBadge type={ann.type} />
                    </div>
                    <p className="text-[11px] text-text-muted">{formatRelative(ann.createdAt)}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Contact Support */}
          <SectionCard title="Need Help?" className="p-6 md:p-8">
            <div className="space-y-3">
              <p className="text-sm text-text-muted mb-2">
                If you face any issues with the portal or assignments, contact us:
              </p>
              
              <div className="p-3 rounded-lg bg-bg-surface border border-border-hairline flex items-center gap-3 hover:border-accent-violet/30 hover:bg-bg-wash-violet transition-colors">
                <div className="p-2 bg-bg-wash-violet rounded-md">
                  <PhoneCall className="h-4 w-4 text-accent-violet" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">Love Varshney</p>
                  <a href="tel:9720028781" className="text-sm font-medium text-text-secondary hover:text-accent-violet transition-colors">
                    +91 97200 28781
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bg-surface border border-border-hairline flex items-center gap-3 hover:border-accent-violet/30 hover:bg-bg-wash-violet transition-colors">
                <div className="p-2 bg-bg-wash-violet rounded-md">
                  <PhoneCall className="h-4 w-4 text-accent-violet" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">Ayush Pratap</p>
                  <a href="tel:9236243578" className="text-sm font-medium text-text-secondary hover:text-accent-violet transition-colors">
                    +91 92362 43578
                  </a>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
