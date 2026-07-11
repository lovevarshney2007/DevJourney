"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, Download, Edit, CheckCircle, Clock, Trash2, Send, RotateCcw } from "lucide-react";
import { PageHeader, Skeleton } from "@/components/ui/Common";
import { DomainBadge, StatusBadge } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { ITask } from "@/types";

export default function AdminTaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-task", id],
    queryFn: () => axios.get(`/api/tasks/${id}`).then((r) => (r.data.data?.task as ITask) || null),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: "draft" | "published" | "archived") =>
      axios.put(`/api/tasks/${id}`, { status: newStatus }),
    onSuccess: (_, newStatus) => {
      toast.success(`Task status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["admin-task", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
    },
    onError: (err) => {
      toast.error("Failed to update status");
      console.error(err);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => axios.delete(`/api/tasks/${id}`),
    onSuccess: () => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      router.push("/admin/tasks");
    },
    onError: () => toast.error("Failed to delete task"),
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-center text-text-muted">Task not found</div>;
  }

  const isDraft = data.status === "draft";
  const isPublished = data.status === "published";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="btn-ghost mb-6 -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="card">
            {/* Header / Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {data.domains.map((d) => (
                  <DomainBadge key={d} domain={d} />
                ))}
              </div>
              <StatusBadge status={data.status} />
            </div>

            <h1 className="text-3xl font-bold text-text-primary mb-4">{data.title}</h1>
            
            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-bg-hover rounded-xl border border-border mb-6">
              {isDraft && (
                <Button 
                  onClick={() => updateStatusMutation.mutate("published")}
                  loading={updateStatusMutation.isPending}
                  className="bg-success text-white hover:bg-success/90"
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Publish Now
                </Button>
              )}
              {isPublished && (
                <Button 
                  variant="outline"
                  onClick={() => updateStatusMutation.mutate("draft")}
                  loading={updateStatusMutation.isPending}
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                >
                  Revert to Draft
                </Button>
              )}
              {/* Note: Edit task page is not fully implemented yet but we route to it */}
              <Button 
                variant="secondary"
                onClick={() => router.push(`/admin/tasks/${id}/edit`)}
                leftIcon={<Edit className="h-4 w-4" />}
              >
                Edit Task
              </Button>
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-text-primary mb-2">Description</h3>
              <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* Document PDF */}
            {data.pdfUrl && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-text-primary mb-3">Assignment Document</h3>
                <a 
                  href={data.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  View / Download PDF
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-4">
          <div className="card-flat space-y-5">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Deadline
              </p>
              <p className="text-sm font-medium text-text-primary">
                {formatDate(data.deadline)}
              </p>
            </div>
            
            <div className="divider" />
            
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Points</p>
              <p className="text-2xl font-bold text-accent">{data.points}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
                  deleteTaskMutation.mutate();
                }
              }}
              className="w-full py-2.5 flex items-center justify-center gap-2 text-sm text-danger hover:bg-danger/10 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
