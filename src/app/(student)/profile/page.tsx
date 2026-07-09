"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Github, Linkedin, Edit3, X, Plus, Check } from "lucide-react";
import { Avatar, PageHeader } from "@/components/ui/Common";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/validations";
import { IUser } from "@/types";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => axios.get("/api/auth/me").then((r) => r.data.data as IUser),
  });

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: user?.name || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      skills: user?.skills || [],
    },
  });

  const skills = watch("skills") || [];

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setValue("skills", [...skills, newSkill.trim()]);
    setNewSkill("");
  };

  const removeSkill = (i: number) => {
    setValue("skills", skills.filter((_, j) => j !== i));
  };

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => axios.patch("/api/profile", data),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setEditing(false);
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading || !user) {
    return <div className="p-6"><div className="h-64 skeleton rounded-xl" /></div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader
        title="Profile"
        description="Manage your developer profile"
        actions={
          !editing ? (
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : undefined
        }
      />

      <div className="space-y-5">
        {/* Avatar + Basic Info */}
        <div className="card">
          <div className="flex items-start gap-5">
            <Avatar name={user.name} src={user.avatar} size="lg" />
            <div className="flex-1">
              {editing ? (
                <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
                  <Input label="Full Name" error={errors.name?.message} {...register("name")} />
                  <Input label="GitHub Profile URL" placeholder="https://github.com/yourusername" error={errors.github?.message} {...register("github")} />
                  <Input label="LinkedIn Profile URL" placeholder="https://linkedin.com/in/yourusername" error={errors.linkedin?.message} {...register("linkedin")} />

                  {/* Skills */}
                  <div>
                    <label className="label">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">
                          {skill}
                          <button type="button" onClick={() => removeSkill(i)}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        placeholder="Add a skill..."
                        className="input flex-1"
                      />
                      <button type="button" onClick={addSkill} className="btn-secondary px-3">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                    <Button type="submit" loading={isSubmitting}>Save Changes</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{user.name}</h2>
                    <p className="text-text-muted text-sm">{user.email}</p>
                    {user.studentNumber && (
                      <p className="text-xs text-text-muted font-mono mt-0.5">#{user.studentNumber}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {user.github && (
                      <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors">
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                    {user.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent transition-colors">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                  {user.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {user.skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card text-center">
            <p className="text-3xl font-bold text-text-primary">{user.completedTasks}</p>
            <p className="text-xs text-text-muted mt-1">Tasks Completed</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Member Since</p>
            <p className="text-sm font-medium text-text-primary">{new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
