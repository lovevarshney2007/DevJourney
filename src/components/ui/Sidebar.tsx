"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Menu, X, LucideIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Common";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  user: { name: string; email: string; avatar?: string; studentNumber?: string };
  navItems: NavItem[];
  role: "ADMIN" | "STUDENT";
  subtitle: string;
}

export function Sidebar({ user, navItems, role, subtitle }: SidebarProps) {
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

  // Determine base path for active state matching
  const basePath = role === "ADMIN" ? "/admin/dashboard" : "/dashboard";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-bg-surface">
      {/* Logo & Header */}
      <Link href="/" className="flex items-center gap-3 px-4 py-5 border-b border-border-hairline hover:opacity-80 transition-opacity">
        {/* Logo */}
        <div className="relative h-8 w-8 flex-shrink-0 rounded-[4px] border border-border-hairline bg-transparent overflow-hidden">
          <Image 
            src="/images/ccclogo.png" 
            alt="CCC Logo" 
            fill 
            className="object-contain p-0.5 invert opacity-80"
            priority
          />
        </div>
        <div className="min-w-0 flex flex-col items-start gap-1">
          <div className="leading-none">
            <p className="font-bold text-text-primary text-sm leading-tight">DevJourney</p>
            <p className="text-[10px] text-text-muted leading-tight mt-0.5">{subtitle}</p>
          </div>
          {/* Role Tag */}
          <div className="mt-1 px-1.5 py-0.5 rounded-[4px] border border-border-hairline bg-transparent">
            <span className="text-[10px] font-mono font-medium text-text-secondary uppercase tracking-wider leading-none">
              {role}
            </span>
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col space-y-0 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== basePath && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "relative flex items-center w-full px-4 py-[13px] transition-colors duration-150 group",
                active 
                  ? "bg-[rgba(124,58,237,0.045)] text-text-primary" 
                  : "bg-transparent text-text-secondary hover:bg-[rgba(0,0,0,0.03)]"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-violet"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              <div className="flex items-center" style={{ gap: '10px' }}>
                <Icon 
                  className={cn(
                    "flex-shrink-0 relative z-10 transition-colors duration-150",
                    active ? "text-accent-violet" : "text-text-secondary group-hover:text-text-primary"
                  )} 
                  size={16}
                  strokeWidth={1.5}
                />
                <span 
                  className={cn(
                    "relative z-10 font-mono uppercase tracking-wider transition-colors duration-150 text-[11px] mt-0.5",
                    active ? "font-semibold text-text-primary" : "font-medium text-text-secondary group-hover:text-text-primary"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-border-hairline flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} src={user.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
            <p className="text-xs text-text-muted truncate">{user.studentNumber || user.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-[10px] w-full px-3 py-2 rounded-md text-text-secondary hover:bg-[rgba(0,0,0,0.03)] hover:text-danger transition-colors duration-150"
        >
          <LogOut size={16} strokeWidth={1.5} />
          <span className="font-mono uppercase tracking-wider text-[11px] font-medium mt-0.5">Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-bg-surface border-r border-border-hairline fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bg-surface border-b border-border-hairline px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="relative h-7 w-7 flex-shrink-0 rounded-[4px] border border-border-hairline bg-transparent overflow-hidden">
            <Image 
              src="/images/ccclogo.png" 
              alt="CCC Logo" 
              fill 
              className="object-contain p-0.5 invert opacity-80"
              priority
            />
          </div>
          <span className="font-bold text-sm">DevJourney {role === "ADMIN" ? "Admin" : ""}</span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-64 h-full bg-bg-surface border-r border-border-hairline z-10 shadow-2xl"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary transition-colors z-50 bg-bg-surface rounded-full border border-border-hairline"
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
