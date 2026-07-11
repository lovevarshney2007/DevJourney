"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle, FileText } from "lucide-react";
import { PageHeader, Skeleton } from "@/components/ui/Common";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createTaskSchema, CreateTaskInput } from "@/lib/validations";
import { ALL_DOMAINS, Domain, ITask } from "@/types";
import { cn } from "@/lib/utils";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [docUploading, setDocUploading] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [docName, setDocName] = useState("");

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: () => axios.get(`/api/tasks/${id}`).then((r) => (r.data.data as ITask) || null),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      resources: [],
      domains: [],
      status: "draft",
    },
  });

  const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
    control,
    name: "resources",
  });

  const selectedDomains = watch("domains") as Domain[];

  const toggleDomain = (domain: Domain) => {
    const current = selectedDomains || [];
    if (current.includes(domain)) {
      setValue("domains", current.filter((d) => d !== domain));
    } else {
      setValue("domains", [...current, domain]);
    }
  };

  // Pre-fill form when data loads
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        points: task.points,
        deadline: new Date(task.deadline).toISOString().slice(0, 16),
        domains: task.domains as any,
        pdfUrl: task.pdfUrl || "",
        resources: task.resources,
        status: task.status,
      });
      if (task.pdfUrl) {
        setDocUrl(task.pdfUrl);
        setDocName("Existing Document");
      }
    }
  }, [task, reset]);

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF or Word documents allowed");
      return;
    }
    setDocUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "devjourney/tasks/docs");
      const res = await axios.post("/api/upload", fd);
      setDocUrl(res.data.data.url);
      setDocName(file.name);
      setValue("pdfUrl", res.data.data.url);
      toast.success("Document uploaded successfully");
    } catch {
      toast.error("Upload failed. Try again.");
    } finally {
      setDocUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => axios.put(`/api/tasks/${id}`, { ...data, pdfUrl: docUrl }),
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      router.push(`/admin/tasks/${id}`);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Failed to update task");
      }
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="btn-ghost -ml-1">
        <ArrowLeft className="h-4 w-4" /> Back to Task Preview
      </button>

      <PageHeader 
        title="Edit Task" 
        subtitle="Modify task details, requirements, and deadline"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-5">
          <Input label="Task Title *" error={errors.title?.message} {...register("title")} />
          <Textarea label="Description *" rows={6} error={errors.description?.message} {...register("description")} />

          {/* Domain Selector */}
          <div>
            <label className="label">Domains * <span className="text-text-muted font-normal">(select one or more)</span></label>
            <div className="flex flex-wrap gap-2 mt-1">
              {ALL_DOMAINS.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => toggleDomain(domain)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    selectedDomains?.includes(domain)
                      ? "bg-accent text-white border-accent"
                      : "bg-bg-wash-violet text-text-muted border-border-hairline hover:border-accent/40"
                  )}
                >
                  {domain}
                </button>
              ))}
            </div>
            {errors.domains && (
              <p className="text-xs text-danger mt-1">{errors.domains.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="number" label="Maximum Points *" error={errors.points?.message} {...register("points", { valueAsNumber: true })} />
            <Input type="datetime-local" label="Deadline *" error={errors.deadline?.message} {...register("deadline")} />
          </div>

          <Select label="Status" {...register("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </div>

        {/* Assignment Document Upload */}
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-1">Assignment Document <span className="text-text-muted font-normal text-xs">(optional)</span></h3>
          <p className="text-xs text-text-muted mb-4">Upload a PDF or Word document with the full task details.</p>
          {docUrl ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-success">Document present</p>
                <p className="text-xs text-text-muted truncate">{docName}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                  Preview
                </a>
                <button
                  type="button"
                  onClick={() => { setDocUrl(""); setDocName(""); setValue("pdfUrl", ""); }}
                  className="text-danger text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className={`flex flex-col items-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              docUploading ? "border-accent/40 bg-accent/5" : "border-border-hairline hover:border-accent/40 bg-bg-wash-violet"
            }`}>
              {docUploading ? (
                <>
                  <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-text-muted">Uploading document...</span>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-bg-card border border-border-hairline">
                    <FileText className="h-6 w-6 text-text-muted" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-text-secondary font-medium">Click to upload new document</p>
                    <p className="text-xs text-text-muted mt-1">PDF or Word (.docx) — max 2MB</p>
                  </div>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleDocUpload}
                disabled={docUploading}
              />
            </label>
          )}
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg border-border-hairline">Helpful Links & Resources</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendResource({ title: "", url: "" })} leftIcon={<Plus className="h-4 w-4" />}>
              Add Link
            </Button>
          </div>
          
          <div className="space-y-3">
            {resourceFields.map((field, i) => (
              <div key={field.id} className="flex gap-3 items-start bg-bg-wash-violet p-3 rounded-lg border border-border-hairline">
                <div className="flex-1 space-y-3">
                  <Input placeholder="Resource Title" {...register(`resources.${i}.title`)} />
                  <Input placeholder="URL (https://...)" {...register(`resources.${i}.url`)} />
                </div>
                <button type="button" onClick={() => removeResource(i)} className="btn-ghost text-danger hover:bg-danger/10 p-2 h-10 mt-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {resourceFields.length === 0 && (
              <p className="text-sm text-text-muted text-center py-4 bg-bg rounded-lg border border-dashed border-border-hairline">
                No resources added. Click "Add Link" to provide helpful articles or videos.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="primary" loading={updateMutation.isPending || isSubmitting} leftIcon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
