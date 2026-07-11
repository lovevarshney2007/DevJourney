"use client";

import {
  LayoutDashboard,
  ClipboardList,
  Send,
  User,
  Megaphone,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";

interface StudentSidebarProps {
  user: { name: string; email: string; avatar?: string; studentNumber?: string };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/submissions", label: "My Submissions", icon: Send },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/profile", label: "Profile", icon: User },
];

export function StudentSidebar({ user }: StudentSidebarProps) {
  return (
    <Sidebar 
      user={user} 
      navItems={navItems} 
      role="STUDENT" 
      subtitle="CCC · AKGEC" 
    />
  );
}
