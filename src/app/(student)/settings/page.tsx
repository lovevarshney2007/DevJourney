"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, User, Github, Linkedin, Camera } from "lucide-react";
import { PageHeader, Skeleton, Avatar } from "@/components/ui/Common";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { IUser } from "@/types";
import { useState } from "react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [avatarUrl, setAvatarUrl] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => axios.get("/api/auth/me").then((r) => r.data.data as IUser),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      github: "",
      linkedin: "",
    },
  });

  import("react").then((React) => {
    React.useEffect(() => {
      if (user) {
        reset({
          name: user.name,
          github: user.github || "",
          linkedin: user.linkedin || "",
        });
        setAvatarUrl(user.avatar || "");
      }
    }, [user, reset]);
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => axios.put("/api/auth/me", { ...data, avatar: avatarUrl }),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your profile and public links"
      />

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="flex items-center gap-6 pb-6 border-b border-border">
            <div className="relative group">
              <Avatar name={user?.name || "?"} src={avatarUrl} size="lg" className="h-24 w-24 text-2xl" />
              <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white mb-1" />
                <span className="text-[10px] text-white font-medium">Coming Soon</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">{user?.name}</h3>
              <p className="text-sm text-text-muted">{user?.email}</p>
              <p className="text-xs font-mono text-accent mt-1 bg-accent/10 px-2 py-0.5 rounded inline-block">
                ID: {user?.studentNumber}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <Input 
              label="Full Name" 
              {...register("name")} 
              icon={<User className="h-4 w-4" />}
            />
            
            <Input 
              label="GitHub Profile URL" 
              placeholder="https://github.com/yourusername"
              {...register("github")} 
              icon={<Github className="h-4 w-4" />}
            />

            <Input 
              label="LinkedIn Profile URL" 
              placeholder="https://linkedin.com/in/yourusername"
              {...register("linkedin")} 
              icon={<Linkedin className="h-4 w-4" />}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              loading={updateMutation.isPending} 
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
