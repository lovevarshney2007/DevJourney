"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Mail, Hash, Calendar, Trophy, CheckCircle, ExternalLink, Users } from "lucide-react";
import { PageHeader, Skeleton, Avatar, EmptyState } from "@/components/ui/Common";
import { StatusBadge, DomainBadge } from "@/components/ui/Badges";
import { formatRelative, formatDate } from "@/lib/utils";
import { IUser, ISubmission, ITask } from "@/types";

interface StudentDetailData {
  student: IUser;
  submissions: ISubmission[];
}

export default function AdminStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-student", id],
    queryFn: () => axios.get(`/api/students/${id}`).then((r) => (r.data.data as StudentDetailData) || null),
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!data?.student) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="btn-ghost mb-6 -ml-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <EmptyState icon={<Users className="h-8 w-8" />} title="Student Not Found" description="The student you are looking for does not exist." />
      </div>
    );
  }

  const { student, submissions } = data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="btn-ghost -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back to Students
      </button>

      {/* Profile Header */}
      <div className="card overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar name={student.name} src={student.avatar} size="lg" className="h-24 w-24 text-2xl" />
          
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-text-primary truncate">{student.name}</h1>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-text-secondary">
              <div className="flex items-center gap-1.5">
                <Hash className="h-4 w-4 text-text-muted" />
                <span className="font-mono">{student.studentNumber}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-text-muted" />
                {student.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-text-muted" />
                Joined {formatDate(student.createdAt)}
              </div>
            </div>
            
            {(student.github || student.linkedin) && (
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                {student.github && (
                  <a href={student.github} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> GitHub
                  </a>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-row md:flex-col gap-4 bg-bg-hover p-4 rounded-xl border border-border">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" /> Total Points
              </p>
              <p className="text-2xl font-bold text-accent">{student.totalPoints}</p>
            </div>
            <div className="hidden md:block divider my-0" />
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> Tasks Done
              </p>
              <p className="text-xl font-semibold text-text-primary">{student.completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Submission History</h3>
        
        {!submissions.length ? (
          <div className="card text-center py-12">
            <p className="text-text-muted">This student has not submitted any tasks yet.</p>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Version</th>
                    <th>Points Awarded</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => {
                    const task = sub.taskId as ITask;
                    return (
                      <tr key={sub._id}>
                        <td>
                          <div>
                            <p className="text-sm font-medium text-text-primary max-w-[250px] truncate">
                              {task && typeof task === "object" ? task.title : "Deleted Task"}
                            </p>
                            {task && typeof task === "object" && (
                              <div className="flex gap-1 mt-1">
                                {task.domains?.slice(0, 2).map((d) => <DomainBadge key={d} domain={d} size="sm" />)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td><StatusBadge status={sub.status} isLate={sub.isLate} /></td>
                        <td className="text-xs text-text-muted">{formatRelative(sub.submittedAt)}</td>
                        <td>
                          {sub.version > 1 ? (
                            <span className="badge badge-blue">v{sub.version}</span>
                          ) : (
                            <span className="text-xs text-text-muted">v1</span>
                          )}
                        </td>
                        <td>
                          {sub.status === "approved" ? (
                            <span className="font-semibold text-text-primary">+{(sub.taskId as any).points} pts</span>
                          ) : (
                            <span className="text-sm text-text-muted">—</span>
                          )}
                        </td>
                        <td>
                          <Link href={`/admin/submissions/${sub._id}`} className="btn-ghost btn-sm">
                            Review <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
