"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus, Trash2, Upload, ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Common";
import { DomainBadge } from "@/components/ui/Badges";
import { createTaskSchema, CreateTaskInput } from "@/lib/validations";
import { ALL_DOMAINS, Domain } from "@/types";
import { cn } from "@/lib/utils";

export default function NewTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: "draft",
      resources: [],
      points: 100,
      domains: [],
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "devjourney/tasks/pdfs");
      const res = await axios.post("/api/upload", fd);
      setPdfUrl(res.data.data.url);
      toast.success("PDF uploaded");
    } catch {
      toast.error("PDF upload failed");
    } finally {
      setPdfUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => axios.post("/api/tasks", { ...data, pdfUrl }),
    onSuccess: () => {
      toast.success("Task created!");
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      router.push("/admin/tasks");
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Failed to create task");
      }
    },
  });

  const onSubmit = (data: CreateTaskInput) => createMutation.mutate(data);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button onClick={() => router.back()} className="btn-ghost mb-6 -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <PageHeader title="Create New Task" description="Fill in the details to create a new task" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-5">
          <Input
            label="Task Title *"
            placeholder="Build a REST API with Node.js and Express"
            error={errors.title?.message}
            {...register("title")}
          />

          <Textarea
            label="Description *"
            placeholder="Describe the task requirements, objectives, and expected outcome..."
            rows={5}
            error={errors.description?.message}
            {...register("description")}
          />

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
                      ? "bg-accent text-white border-accent shadow-glow-sm"
                      : "bg-bg-hover text-text-muted border-border hover:border-accent/40"
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deadline *"
              type="datetime-local"
              error={errors.deadline?.message}
              {...register("deadline")}
            />
            <Input
              label="Points *"
              type="number"
              min={1}
              max={1000}
              error={errors.points?.message}
              {...register("points", { valueAsNumber: true })}
            />
          </div>

          {/* Status */}
          <Select label="Status" {...register("status")}>
            <option value="draft">Draft (save for later)</option>
            <option value="published">Published (visible to students)</option>
          </Select>
        </div>

        {/* PDF Upload */}
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-4">Assignment PDF (optional)</h3>
          {pdfUrl ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20">
              <span className="text-sm text-success">PDF uploaded successfully</span>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline ml-auto">
                Preview
              </a>
              <button type="button" onClick={() => setPdfUrl("")} className="text-danger text-xs">Remove</button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent/40 transition-colors bg-bg-hover">
              <Upload className="h-6 w-6 text-text-muted" />
              <span className="text-sm text-text-muted">
                {pdfUploading ? "Uploading..." : "Click to upload PDF"}
              </span>
              <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={pdfUploading} />
            </label>
          )}
        </div>

        {/* Resources */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Reference Resources</h3>
            <button
              type="button"
              onClick={() => appendResource({ title: "", url: "" })}
              className="btn-ghost btn-sm"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
          {resourceFields.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">No resources added yet</p>
          ) : (
            <div className="space-y-3">
              {resourceFields.map((field, i) => (
                <div key={field.id} className="flex gap-3">
                  <Input
                    placeholder="Resource title"
                    error={errors.resources?.[i]?.title?.message}
                    {...register(`resources.${i}.title`)}
                  />
                  <Input
                    placeholder="https://..."
                    error={errors.resources?.[i]?.url?.message}
                    {...register(`resources.${i}.url`)}
                  />
                  <button type="button" onClick={() => removeResource(i)} className="btn-ghost p-2 text-danger flex-shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting || createMutation.isPending} className="flex-1">
            Create Task
          </Button>
        </div>
      </form>
    </div>
  );
}
