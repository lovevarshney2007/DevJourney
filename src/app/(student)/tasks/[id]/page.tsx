"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, Calendar, Download, ExternalLink, Github,
  Link2, FileText, Upload, X, Send, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { DomainBadge, StatusBadge } from "@/components/ui/Badges";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Common";
import { createSubmissionSchema, CreateSubmissionInput } from "@/lib/validations";
import { formatDate, formatDateTime, isDeadlinePassed, isDeadlineSoon, cn } from "@/lib/utils";
import { ITask, ISubmission } from "@/types";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: () =>
      axios.get(`/api/tasks/${id}`).then((r) => r.data.data as { task: ITask; mySubmission: ISubmission | null }),
  });

  const { task, mySubmission } = data || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSubmissionInput>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      taskId: id,
      videoDriveUrl: mySubmission?.videoDriveUrl || "",
      deployUrl: mySubmission?.deployUrl || "",
      description: mySubmission?.description || "",
      notes: mySubmission?.notes || "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingFiles(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "devjourney/submissions");
        const res = await axios.post("/api/upload", fd);
        setUploadedFiles((prev) => [...prev, { url: res.data.data.url, name: file.name }]);
      }
      toast.success("Files uploaded");
    } catch {
      toast.error("File upload failed");
    } finally {
      setUploadingFiles(false);
    }
  };

  const onSubmit = async (data: CreateSubmissionInput) => {
    setSubmitting(true);
    try {
      await axios.post("/api/submissions", {
        ...data,
        files: uploadedFiles.map((f) => f.url),
      });
      toast.success(mySubmission ? "Submission updated!" : "Submission sent!");
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      setShowForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-muted">Task not found</p>
      </div>
    );
  }

  const isPast = isDeadlinePassed(task.deadline);
  const isSoon = isDeadlineSoon(task.deadline);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => router.back()} className="btn-ghost mb-6 -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back to tasks
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header */}
          <div className="card">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {task.domains.map((d) => <DomainBadge key={d} domain={d} />)}
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-3">{task.title}</h1>
            <p className="text-text-secondary text-sm leading-relaxed">{task.description}</p>

            {/* Resources */}
            {task.resources?.length > 0 && (
              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Resources</p>
                <div className="space-y-2">
                  {task.resources.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      {r.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* PDF */}
            {task.pdfUrl && (
              <div className="mt-4">
                <a href={task.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
                  <Download className="h-4 w-4" />
                  Download Assignment PDF
                </a>
              </div>
            )}
          </div>

          {/* Current Submission Status */}
          {mySubmission && (
            <div className="card border-border/80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text-primary">Your Submission</h3>
                <StatusBadge status={mySubmission.status} isLate={mySubmission.isLate} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Github className="h-4 w-4" />
                  <a href={mySubmission.githubUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate">
                    {mySubmission.githubUrl}
                  </a>
                </div>
                <p className="text-xs text-text-muted">
                  {mySubmission.resubmittedAt
                    ? `Resubmitted ${formatDateTime(mySubmission.resubmittedAt)} (v${mySubmission.version})`
                    : `Submitted ${formatDateTime(mySubmission.submittedAt)}`}
                </p>
              </div>
              {(mySubmission.status === "changes_requested" || mySubmission.status === "rejected" || mySubmission.status === "pending") && (
                <button onClick={() => setShowForm(true)} className="btn-secondary btn-sm mt-3">
                  Update Submission
                </button>
              )}
            </div>
          )}

          {/* Submission Form */}
          <AnimatePresence>
            {(showForm || !mySubmission) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-text-primary">
                    {mySubmission ? "Update Submission" : "Submit Your Work"}
                  </h3>
                  {showForm && (
                    <button onClick={() => setShowForm(false)} className="btn-ghost p-1">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {isPast && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20 mb-4">
                    <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                    <p className="text-xs text-warning">Deadline has passed. This will be marked as a late submission.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <input type="hidden" value={id} {...register("taskId")} />

                  <Input
                    label="GitHub Repository URL *"
                    placeholder="https://github.com/yourusername/project"
                    error={errors.githubUrl?.message}
                    {...register("githubUrl")}
                  />

                  <Input
                    label="Demo Video (Google Drive Link)"
                    placeholder="https://drive.google.com/..."
                    error={errors.videoDriveUrl?.message}
                    hint="Optional — share a Google Drive link to your demo video"
                    {...register("videoDriveUrl")}
                  />

                  <Input
                    label="Live Deployment URL"
                    placeholder="https://your-project.vercel.app"
                    error={errors.deployUrl?.message}
                    hint="Optional — deployed project link"
                    {...register("deployUrl")}
                  />

                  <Textarea
                    label="Project Description *"
                    placeholder="Describe what you built, technologies used, features implemented, challenges faced..."
                    rows={5}
                    error={errors.description?.message}
                    {...register("description")}
                  />

                  <Textarea
                    label="Additional Notes"
                    placeholder="Any additional information for the reviewer..."
                    rows={2}
                    {...register("notes")}
                  />

                  {/* File Upload */}
                  <div>
                    <label className="label">Attach Files (optional)</label>
                    <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/40 transition-colors bg-bg-hover">
                      <Upload className="h-5 w-5 text-text-muted" />
                      <span className="text-sm text-text-muted">
                        {uploadingFiles ? "Uploading..." : "Click to upload files"}
                      </span>
                      <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploadingFiles} />
                    </label>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-success">
                            <FileText className="h-3.5 w-3.5" />
                            {f.name}
                            <button type="button" onClick={() => setUploadedFiles((prev) => prev.filter((_, j) => j !== i))}>
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    loading={submitting}
                    className="w-full"
                    rightIcon={<Send className="h-4 w-4" />}
                  >
                    {mySubmission ? "Update Submission" : "Submit Work"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card-flat space-y-4">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Deadline</p>
              <p className={cn(
                "text-sm font-medium",
                isPast ? "text-danger" : isSoon ? "text-warning" : "text-text-primary"
              )}>
                {isPast ? "Closed — " : ""}
                {formatDate(task.deadline)}
              </p>
            </div>
            <div className="divider" />
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Points</p>
              <p className="text-2xl font-bold text-accent">{task.points}</p>
            </div>
            <div className="divider" />
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Status</p>
              {mySubmission ? (
                <StatusBadge status={mySubmission.status} isLate={mySubmission.isLate} />
              ) : (
                <span className="text-sm text-text-muted">Not submitted</span>
              )}
            </div>
          </div>

          {!mySubmission && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary w-full"
            >
              <Send className="h-4 w-4" />
              Submit Work
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
