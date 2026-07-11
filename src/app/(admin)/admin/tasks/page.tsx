"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Pencil, Trash2, Eye, Archive, UploadCloud, Upload } from "lucide-react";
import Link from "next/link";
import { DomainBadge, StatusBadge } from "@/components/ui/Badges";
import { EmptyState, PageHeader, Skeleton } from "@/components/ui/Common";
import { ConfirmModal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { ITask } from "@/types";

export default function AdminTasksPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tasks", statusFilter],
    queryFn: () =>
      axios.get(`/api/tasks?limit=100${statusFilter ? `&status=${statusFilter}` : ""}`).then((r) => (r.data.data as ITask[]) || []),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/tasks/${id}`),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Delete failed"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axios.patch(`/api/tasks/${id}/status`, { status }),
    onSuccess: (_, vars) => {
      toast.success(`Task ${vars.status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
    },
    onError: () => toast.error("Status update failed"),
  });

  const filtered = data?.filter((t) =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Tasks"
        description="Manage all tasks for CCC members"
        actions={
          <div className="flex gap-2">
            <Link href="/admin/tasks/import" className="btn-secondary btn-sm">
              <Upload className="h-4 w-4" />
              Import
            </Link>
            <Link href="/admin/tasks/new" className="btn-primary btn-sm">
              <Plus className="h-4 w-4" />
              New Task
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input min-w-[150px]"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<UploadCloud className="h-8 w-8" />}
          title="No tasks yet"
          description="Create your first task or import from Excel/Doc."
          action={<Link href="/admin/tasks/new" className="btn-primary">Create Task</Link>}
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Domains</th>
                  <th>Deadline</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td>
                      <p className="font-medium text-text-primary max-w-[240px] truncate">{task.title}</p>
                      <p className="text-xs text-text-muted capitalize">{task.importedFrom}</p>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {task.domains.slice(0, 2).map((d) => <DomainBadge key={d} domain={d} size="sm" />)}
                        {task.domains.length > 2 && (
                          <span className="text-xs text-text-muted">+{task.domains.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{formatDate(task.deadline)}</td>
                    <td>
                      <span className="font-semibold text-accent">{task.points}</span>
                    </td>
                    <td><StatusBadge status={task.status} /></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/tasks/${task._id}`} className="btn-ghost p-1.5" title="View">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/admin/tasks/${task._id}/edit`} className="btn-ghost p-1.5" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        {task.status === "draft" && (
                          <button
                            onClick={() => statusMutation.mutate({ id: task._id, status: "published" })}
                            className="btn-ghost p-1.5 text-accent"
                            title="Publish"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {task.status === "published" && (
                          <button
                            onClick={() => statusMutation.mutate({ id: task._id, status: "archived" })}
                            className="btn-ghost p-1.5 text-text-muted"
                            title="Archive"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(task._id)}
                          className="btn-ghost p-1.5 text-danger"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Task"
        message="This will permanently delete the task and all associated data. This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
