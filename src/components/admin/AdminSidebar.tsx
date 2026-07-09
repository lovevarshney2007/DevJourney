"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Inbox,
  Users,
  Trophy,
  Megaphone,
  LogOut,
  Code2,
  Menu,
  X,
  Shield,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Common";

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
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/me");
      router.push("/login");
      toast.success("Logged out");
    } catch {
      router.push("/login");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
        <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
          <Code2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="font-bold text-text-primary text-sm">DevJourney</p>
          <p className="text-[10px] text-text-muted">Admin Panel</p>
        </div>
      </div>

      {/* Admin badge */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Shield className="h-3 w-3 text-purple-400" />
          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
            Administrator
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(active ? "sidebar-item-active" : "sidebar-item")}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-border space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <Avatar name={user.name} src={user.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
            <p className="text-[11px] text-text-muted truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-item w-full text-danger hover:text-danger hover:bg-danger/10">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 h-screen bg-bg-secondary border-r border-border fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bg-secondary border-b border-border px-4 py-3 flex items-center justify-between glass">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-accent" />
          <span className="font-bold text-sm">DevJourney Admin</span>
        </div>
        <button onClick={() => setOpen(true)} className="btn-ghost p-2">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            className="relative w-60 h-full bg-bg-secondary border-r border-border z-10"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 btn-ghost p-1"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent />
          </motion.aside>
        </div>
      )}
    </>
  );
}
