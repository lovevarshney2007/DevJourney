"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, ChevronRight } from "lucide-react";
import { StatusBadge, DomainBadge } from "@/components/ui/Badges";
import { EmptyState, PageHeader, Skeleton, Avatar } from "@/components/ui/Common";
import { formatRelative } from "@/lib/utils";
import { ISubmission, ITask, IUser } from "@/types";

export default function AdminSubmissionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isLate, setIsLate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-submissions", status, isLate],
    queryFn: () =>
      axios.get(`/api/submissions?limit=100${status ? `&status=${status}` : ""}${isLate ? `&isLate=${isLate}` : ""}`).then((r) => r.data.data as ISubmission[]),
  });

  const filtered = data?.filter((s) => {
    if (!search) return true;
    const student = s.studentId as IUser;
    const task = s.taskId as ITask;
    const name = typeof student === "object" ? student.name?.toLowerCase() : "";
    const title = typeof task === "object" ? task.title?.toLowerCase() : "";
    return name.includes(search.toLowerCase()) || title.includes(search.toLowerCase());
  }) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Submissions Inbox"
        description="Review and manage all student submissions"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by student or task..." className="input pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input min-w-[160px]">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="changes_requested">Changes Requested</option>
        </select>
        <select value={isLate} onChange={(e) => setIsLate(e.target.value)} className="input min-w-[140px]">
          <option value="">All Submissions</option>
          <option value="true">Late Only</option>
          <option value="false">On Time Only</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Filter className="h-8 w-8" />} title="No submissions found" description="Try adjusting your filters." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Version</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const student = sub.studentId as IUser;
                  const task = sub.taskId as ITask;
                  return (
                    <tr key={sub._id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={typeof student === "object" ? student.name : "?"} size="sm" />
                          <div>
                            <p className="font-medium text-text-primary text-sm">
                              {typeof student === "object" ? student.name : "—"}
                            </p>
                            <p className="text-xs text-text-muted">
                              {typeof student === "object" ? student.studentNumber : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="text-sm text-text-primary max-w-[180px] truncate">
                            {typeof task === "object" ? task.title : "—"}
                          </p>
                          {typeof task === "object" && (
                            <div className="flex gap-1 mt-1">
                              {task.domains?.slice(0, 1).map((d) => <DomainBadge key={d} domain={d} size="sm" />)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td><StatusBadge status={sub.status} isLate={sub.isLate} /></td>
                      <td className="text-xs text-text-muted whitespace-nowrap">{formatRelative(sub.submittedAt)}</td>
                      <td>
                        {sub.version > 1 ? (
                          <span className="badge badge-blue">v{sub.version}</span>
                        ) : (
                          <span className="text-xs text-text-muted">v1</span>
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
  );
}
