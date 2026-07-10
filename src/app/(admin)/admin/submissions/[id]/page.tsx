"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, Github, ExternalLink, FileText, CheckCircle,
  XCircle, RotateCcw, User, Calendar, Zap, AlertTriangle
} from "lucide-react";
import { StatusBadge, DomainBadge } from "@/components/ui/Badges";
import { Avatar, Skeleton } from "@/components/ui/Common";
import { Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createReviewSchema, CreateReviewInput } from "@/lib/validations";
import { formatDateTime } from "@/lib/utils";
import { ISubmission, ITask, IUser, IReview } from "@/types";

export default function AdminSubmissionReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["submission-detail", id],
    queryFn: () =>
      axios.get(`/api/submissions/${id}`).then((r) => r.data.data as { submission: ISubmission; review: IReview | null }),
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateReviewInput>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      submissionId: id,
      status: "approved",
      feedback: data?.review?.feedback || "",
      pointsAwarded: data?.review?.pointsAwarded || 0,
    },
  });

  const reviewStatus = watch("status");

  const reviewMutation = useMutation({
    mutationFn: (data: CreateReviewInput) => axios.post("/api/reviews", data),
    onSuccess: () => {
      toast.success("Review submitted!");
      queryClient.invalidateQueries({ queryKey: ["submission-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.error || "Review failed");
    },
  });

  if (isLoading) {
    return <div className="p-6 max-w-5xl mx-auto space-y-4"><Skeleton className="h-8 w-32" /><Skeleton className="h-96 w-full" /></div>;
  }

  const { submission, review } = data || {};
  if (!submission) return <div className="p-6 text-center text-text-muted">Submission not found</div>;

  const task = submission.taskId as ITask;
  const student = submission.studentId as IUser;

  const statusColors = {
    approved: "bg-success/10 border-success/30 text-success",
    rejected: "bg-danger/10 border-danger/30 text-danger",
    changes_requested: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="btn-ghost mb-6 -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back to Submissions
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Submission Details — Left */}
        <div className="lg:col-span-3 space-y-5">
          {/* Task + Student Info */}
          <div className="card">
            <div className="flex items-start gap-4 mb-4">
              <Avatar name={student && typeof student === "object" ? student.name : "?"} size="md" />
              <div>
                <p className="font-semibold text-text-primary text-lg">
                  {student && typeof student === "object" ? student.name : "Unknown Student"}
                </p>
                <p className="text-sm text-text-secondary">
                  {student && typeof student === "object" ? `${student.email} · ${student.studentNumber}` : ""}
                </p>
              </div>
              <StatusBadge status={submission.status} isLate={submission.isLate} />
            </div>

            <div className="p-3.5 rounded-xl bg-bg-hover border border-border">
              <p className="text-xs text-text-muted mb-1">Task</p>
              <p className="font-medium text-text-primary text-sm">
                {task && typeof task === "object" ? task.title : "Deleted Task"}
              </p>
              {task && typeof task === "object" && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {task.domains?.map((d) => <DomainBadge key={d} domain={d} size="sm" />)}
                  <span className="text-xs text-accent font-semibold ml-auto">{task.points} max pts</span>
                </div>
              )}
            </div>

            {submission.isLate && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <p className="text-xs text-orange-400 font-medium">Late submission</p>
              </div>
            )}
          </div>

          {/* Submission Content */}
          <div className="card space-y-4">
            <h3 className="font-semibold text-text-primary">Submission</h3>
            <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:underline break-all">
              <Github className="h-4 w-4 flex-shrink-0" />
              {submission.githubUrl}
            </a>
            {submission.videoDriveUrl && (
              <a href={submission.videoDriveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline">
                <ExternalLink className="h-4 w-4" />
                Demo Video (Drive)
              </a>
            )}
            {submission.deployUrl && (
              <a href={submission.deployUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline">
                <ExternalLink className="h-4 w-4" />
                Live Deployment
              </a>
            )}

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{submission.description}</p>
            </div>

            {submission.notes && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Notes</p>
                <p className="text-sm text-text-secondary">{submission.notes}</p>
              </div>
            )}

            {submission.files?.length > 0 && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Files</p>
                <div className="space-y-1">
                  {submission.files.map((f, i) => (
                    <a key={i} href={f} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-accent hover:underline">
                      <FileText className="h-3.5 w-3.5" />
                      File {i + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-text-muted pt-2 border-t border-border">
              {submission.resubmittedAt
                ? `Resubmitted ${formatDateTime(submission.resubmittedAt)} · v${submission.version}`
                : `Submitted ${formatDateTime(submission.submittedAt)}`}
            </p>
          </div>
        </div>

        {/* Review Panel — Right */}
        <div className="lg:col-span-2">
          <div className="card sticky top-6">
            <h3 className="font-semibold text-text-primary mb-5">
              {review ? "Update Review" : "Submit Review"}
            </h3>

            {review && (
              <div className="mb-4 p-3 rounded-xl bg-bg-hover border border-border">
                <p className="text-xs text-text-muted mb-1">Previous review</p>
                <StatusBadge status={review.status} />
                <p className="text-xs text-text-muted mt-1">{review.pointsAwarded} points awarded</p>
              </div>
            )}

            <form onSubmit={handleSubmit((data) => reviewMutation.mutate(data))} className="space-y-4">
              <input type="hidden" value={id} {...register("submissionId")} />

              {/* Status buttons */}
              <div>
                <label className="label">Decision *</label>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  {[
                    { value: "approved", label: "Approve", icon: <CheckCircle className="h-4 w-4" />, cls: "bg-success/10 border-success/30 text-success hover:bg-success/20" },
                    { value: "changes_requested", label: "Request Changes", icon: <RotateCcw className="h-4 w-4" />, cls: "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20" },
                    { value: "rejected", label: "Reject", icon: <XCircle className="h-4 w-4" />, cls: "bg-danger/10 border-danger/30 text-danger hover:bg-danger/20" },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      reviewStatus === opt.value ? opt.cls : "border-border bg-bg-hover text-text-muted hover:border-border"
                    }`}>
                      <input type="radio" value={opt.value} className="sr-only" {...register("status")} />
                      {opt.icon}
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.status && <p className="text-xs text-danger mt-1">{errors.status.message}</p>}
              </div>

              {/* Points */}
              <div>
                <label className="label">
                  Points Awarded * <span className="text-text-muted font-normal">(max: {task && typeof task === "object" ? task.points : 1000})</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={task && typeof task === "object" ? task.points : 1000}
                  className="input"
                  {...register("pointsAwarded", { valueAsNumber: true })}
                />
                {errors.pointsAwarded && <p className="text-xs text-danger">{errors.pointsAwarded.message}</p>}
              </div>

              <Textarea
                label="Feedback *"
                placeholder="Provide detailed feedback on the submission — what was done well, what can be improved, any specific changes needed..."
                rows={6}
                error={errors.feedback?.message}
                {...register("feedback")}
              />

              <Button
                type="submit"
                loading={reviewMutation.isPending}
                className="w-full"
              >
                {review ? "Update Review" : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
