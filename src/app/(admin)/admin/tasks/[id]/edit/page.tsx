"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { PageHeader, Skeleton } from "@/components/ui/Common";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createTaskSchema, CreateTaskInput, taskResourceSchema } from "@/lib/validations";
import { ITask } from "@/types";
import { z } from "zod";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: () => axios.get(`/api/tasks/${id}`).then((r) => r.data.data as ITask),
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

  // Pre-fill form when data loads
  import("react").then((React) => {
    React.useEffect(() => {
      if (task) {
        reset({
          title: task.title,
          description: task.description,
          points: task.points,
          deadline: new Date(task.deadline).toISOString().split('T')[0],
          domains: task.domains as any,
          pdfUrl: task.pdfUrl || "",
          resources: task.resources,
          status: task.status,
        });
      }
    }, [task, reset]);
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateTaskInput) => axios.put(`/api/tasks/${id}`, data),
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

  const currentResources = watch("resources") || [];
  const addResource = () => setValue("resources", [...currentResources, { title: "", url: "", type: "link" }]);
  const removeResource = (index: number) => setValue("resources", currentResources.filter((_, i) => i !== index));

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
        <div className="card space-y-4">
          <Input label="Task Title *" error={errors.title?.message} {...register("title")} />
          <TextArea label="Description *" rows={6} error={errors.description?.message} {...register("description")} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input type="number" label="Maximum Points *" error={errors.points?.message} {...register("points", { valueAsNumber: true })} />
            <Input type="date" label="Deadline *" error={errors.deadline?.message} {...register("deadline")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Domains (comma separated) *" 
              placeholder="frontend, backend, design"
              error={errors.domains?.message} 
              {...register("domains", {
                setValueAs: (v) => v.split(',').map((s: string) => s.trim()).filter(Boolean)
              })} 
            />
            <Input label="Status" type="text" readOnly value={watch("status")} disabled hint="Status can be changed from the preview page" />
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Documents & Resources</h3>
          
          <Input 
            label="Assignment PDF Document URL" 
            placeholder="https://res.cloudinary.com/..."
            error={errors.pdfUrl?.message} 
            {...register("pdfUrl")} 
            hint="Leave empty if you don't want to upload a PDF"
          />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">Helpful Links & Resources</label>
              <Button type="button" variant="outline" size="sm" onClick={addResource} leftIcon={<Plus className="h-4 w-4" />}>
                Add Link
              </Button>
            </div>
            
            <div className="space-y-3">
              {currentResources.map((res, index) => (
                <div key={index} className="flex gap-3 items-start bg-bg-hover p-3 rounded-lg border border-border">
                  <div className="flex-1 space-y-3">
                    <Input placeholder="Resource Title (e.g. React Docs)" {...register(`resources.${index}.title` as const)} />
                    <Input placeholder="URL (https://...)" {...register(`resources.${index}.url` as const)} />
                  </div>
                  <button type="button" onClick={() => removeResource(index)} className="btn-ghost text-danger hover:bg-danger/10 p-2 h-10 mt-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {currentResources.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4 bg-bg rounded-lg border border-dashed border-border">
                  No resources added. Click "Add Link" to provide helpful articles or videos.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="primary" loading={updateMutation.isPending} leftIcon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
