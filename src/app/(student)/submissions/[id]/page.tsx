"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Github, ExternalLink, FileText, MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { StatusBadge, DomainBadge } from "@/components/ui/Badges";
import { Skeleton } from "@/components/ui/Common";
import { formatDateTime } from "@/lib/utils";
import { ISubmission, ITask, IReview } from "@/types";

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["submission", id],
    queryFn: () =>
      axios.get(`/api/submissions/${id}`).then((r) => r.data.data as { submission: ISubmission; review: IReview | null }),
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const { submission, review } = data || {};
  if (!submission) return <div className="p-6 text-center text-text-muted">Submission not found</div>;

  const task = submission.taskId as ITask;

  const ReviewIcon =
    review?.status === "approved"
      ? CheckCircle
      : review?.status === "rejected"
      ? XCircle
      : AlertCircle;

  const reviewColor =
    review?.status === "approved"
      ? "text-success"
      : review?.status === "rejected"
      ? "text-danger"
      : "text-warning";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="btn-ghost mb-6 -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="space-y-5">
        {/* Task Info */}
        <div className="card">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary mb-2">
                {typeof task === "object" ? task.title : "Task"}
              </h1>
              {typeof task === "object" && (
                <div className="flex flex-wrap gap-1.5">
                  {task.domains?.map((d) => <DomainBadge key={d} domain={d} />)}
                </div>
              )}
            </div>
            <StatusBadge status={submission.status} isLate={submission.isLate} />
          </div>
          <div className="text-xs text-text-muted">
            {submission.resubmittedAt
              ? `Last updated ${formatDateTime(submission.resubmittedAt)} · v${submission.version}`
              : `Submitted ${formatDateTime(submission.submittedAt)}`}
            {submission.isLate && (
              <span className="ml-2 text-orange-400 font-medium">· Late submission</span>
            )}
          </div>
        </div>

        {/* Submission Details */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-text-primary">Submission Details</h2>
          <div className="space-y-3">
            <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:underline">
              <Github className="h-4 w-4" />
              {submission.githubUrl}
            </a>
            {submission.videoDriveUrl && (
              <a href={submission.videoDriveUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline">
                <ExternalLink className="h-4 w-4" />
                Demo Video (Google Drive)
              </a>
            )}
            {submission.deployUrl && (
              <a href={submission.deployUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:underline">
                <ExternalLink className="h-4 w-4" />
                Live Deployment
              </a>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Description</p>
            <p className="text-sm text-text-secondary whitespace-pre-wrap">{submission.description}</p>
          </div>

          {submission.notes && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-text-secondary">{submission.notes}</p>
            </div>
          )}

          {submission.files?.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Attached Files</p>
              <div className="space-y-1.5">
                {submission.files.map((f, i) => (
                  <a key={i} href={f} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:underline">
                    <FileText className="h-4 w-4" />
                    File {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        {review && (
          <div className="card border-border/80">
            <div className="flex items-center gap-2 mb-4">
              <ReviewIcon className={`h-5 w-5 ${reviewColor}`} />
              <h2 className="font-semibold text-text-primary">Admin Feedback</h2>
            </div>
            <div className="p-4 rounded-xl bg-bg-hover border border-border">
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{review.feedback}</p>
            </div>
            <p className="text-xs text-text-muted mt-3">
              Reviewed {formatDateTime(review.reviewedAt)}
            </p>
          </div>
        )}

        {!review && submission.status === "pending" && (
          <div className="card text-center py-8 border-dashed">
            <MessageSquare className="h-6 w-6 text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">Your submission is pending review by the CCC team.</p>
          </div>
        )}
      </div>
    </div>
  );
}
