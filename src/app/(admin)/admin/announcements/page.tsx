"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, Trash2, Megaphone } from "lucide-react";
import { AnnouncementTypeBadge } from "@/components/ui/Badges";
import { EmptyState, PageHeader } from "@/components/ui/Common";
import { ConfirmModal, Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createAnnouncementSchema, CreateAnnouncementInput } from "@/lib/validations";
import { formatRelative } from "@/lib/utils";
import { IAnnouncement, IUser } from "@/types";

export default function AdminAnnouncementsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements-admin"],
    queryFn: () => axios.get("/api/announcements?limit=50").then((r) => (r.data.data as IAnnouncement[]) || []),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateAnnouncementInput>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: { type: "notice" },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAnnouncementInput) => axios.post("/api/announcements", data),
    onSuccess: () => {
      toast.success("Announcement posted!");
      queryClient.invalidateQueries({ queryKey: ["announcements-admin"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setCreateOpen(false);
      reset();
    },
    onError: () => toast.error("Failed to post announcement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/announcements/${id}`),
    onSuccess: () => {
      toast.success("Announcement deleted");
      queryClient.invalidateQueries({ queryKey: ["announcements-admin"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Announcements"
        description="Post updates, notices, and deadlines for all CCC members"
        actions={
          <Button onClick={() => setCreateOpen(true)} size="sm">
            <Plus className="h-4 w-4" />
            New Announcement
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 skeleton rounded-xl" />)}</div>
      ) : !announcements?.length ? (
        <EmptyState
          icon={<Megaphone className="h-8 w-8" />}
          title="No announcements yet"
          description="Post your first announcement for CCC members."
          action={<Button onClick={() => setCreateOpen(true)}>Post Announcement</Button>}
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((ann, i) => {
            const creator = ann.createdBy as IUser;
            return (
              <motion.div key={ann._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AnnouncementTypeBadge type={ann.type} />
                        <span className="text-xs text-text-muted">{formatRelative(ann.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-text-primary mb-1">{ann.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{ann.content}</p>
                    </div>
                    <button onClick={() => setDeleteId(ann._id)} className="btn-ghost p-1.5 text-danger flex-shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => { setCreateOpen(false); reset(); }} title="New Announcement" size="md">
        <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
          <Input label="Title *" placeholder="New wildcard task released!" error={errors.title?.message} {...register("title")} />
          <Textarea label="Content *" placeholder="Write the announcement content..." rows={5} error={errors.content?.message} {...register("content")} />
          <Select label="Type *" error={errors.type?.message} {...register("type")}>
            <option value="notice">Notice</option>
            <option value="task">New Task</option>
            <option value="deadline">Deadline</option>
            <option value="update">Update</option>
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">Post Announcement</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Announcement"
        message="This will permanently remove the announcement for all students."
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
