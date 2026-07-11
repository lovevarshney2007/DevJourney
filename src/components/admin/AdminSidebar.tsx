"use client";

import {
  LayoutDashboard,
  ClipboardList,
  Inbox,
  Users,
  Trophy,
  Megaphone,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";

interface AdminSidebarProps {
  user: { name: string; email: string; avatar?: string };
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <Sidebar 
      user={user} 
      navItems={navItems} 
      role="ADMIN" 
      subtitle="Admin Panel" 
    />
  );
}
