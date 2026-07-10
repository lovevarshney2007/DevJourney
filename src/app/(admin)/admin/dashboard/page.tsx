"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, ClipboardList, Inbox, CheckCircle, TrendingUp, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { StatCard, SectionCard, PageHeader, Avatar } from "@/components/ui/Common";
import { StatusBadge, DomainBadge } from "@/components/ui/Badges";
import { formatRelative } from "@/lib/utils";
import { ISubmission, ITask, IUser } from "@/types";

interface AdminDashboardData {
  totalStudents: number;
  totalTasks: number;
  publishedTasks: number;
  pendingReviews: number;
  recentSubmissions: ISubmission[];
  topStudents: IUser[];
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => axios.get("/api/admin/dashboard").then((r) => r.data.data as AdminDashboardData),
  });

  const stats = [
    { title: "Total Students", value: data?.totalStudents || 0, icon: <Users className="h-5 w-5" />, accentColor: "text-blue-400" },
    { title: "Total Tasks", value: data?.totalTasks || 0, icon: <ClipboardList className="h-5 w-5" />, accentColor: "text-purple-400", description: `${data?.publishedTasks || 0} published` },
    { title: "Pending Reviews", value: data?.pendingReviews || 0, icon: <Inbox className="h-5 w-5" />, accentColor: "text-yellow-400" },
    { title: "Tasks Live", value: data?.publishedTasks || 0, icon: <TrendingUp className="h-5 w-5" />, accentColor: "text-green-400" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of DevJourney platform activity"
        actions={
          <Link href="/admin/submissions" className="btn-primary btn-sm">
            <Inbox className="h-4 w-4" />
            Review Submissions
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
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
        {/* Recent Submissions */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Recent Submissions"
            actions={
              <Link href="/admin/submissions" className="btn-ghost btn-sm">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-14 skeleton rounded-xl" />)}
              </div>
            ) : !data?.recentSubmissions?.length ? (
              <p className="text-text-muted text-sm py-8 text-center">No submissions yet</p>
            ) : (
              <div className="divide-y divide-border">
                {data.recentSubmissions.map((sub) => {
                  const task = sub.taskId as ITask;
                  const student = sub.studentId as IUser;
                  return (
                    <Link key={sub._id} href={`/admin/submissions/${sub._id}`}>
                      <div className="flex items-center justify-between py-3.5 hover:bg-bg-hover px-1 rounded-lg transition-colors group">
                        <div className="flex items-center gap-3">
                          <Avatar name={student && typeof student === "object" ? student.name : "?"} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                              {student && typeof student === "object" ? student.name : "Unknown Student"}
                            </p>
                            <p className="text-xs text-text-muted truncate max-w-[200px]">
                              {task && typeof task === "object" ? task.title : "Deleted Task"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={sub.status} isLate={sub.isLate} />
                          <span className="text-xs text-text-muted hidden sm:block">
                            {formatRelative(sub.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Top Students */}
        <div>
          <SectionCard
            title="Top Students"
            actions={
              <Link href="/admin/leaderboard" className="btn-ghost btn-sm">
                Full board
              </Link>
            }
          >
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 skeleton rounded-xl" />)}
              </div>
            ) : !data?.topStudents?.length ? (
              <p className="text-text-muted text-sm py-4 text-center">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.topStudents.map((student, i) => (
                  <Link key={student._id} href={`/admin/students/${student._id}`}>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-hover transition-colors group">
                      <span className="text-sm font-bold text-text-muted w-5">#{i + 1}</span>
                      <Avatar name={student.name} src={student.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">
                          {student.name}
                        </p>
                        <p className="text-xs text-text-muted">{student.completedTasks} tasks</p>
                      </div>
                      <span className="text-sm font-bold text-accent">{student.totalPoints}pts</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
