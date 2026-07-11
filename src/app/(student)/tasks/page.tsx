"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import axios from "axios";
import { Search, Filter, Calendar, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DomainBadge } from "@/components/ui/Badges";
import { EmptyState, PageHeader, Skeleton } from "@/components/ui/Common";
import { formatDate, isDeadlineSoon, isDeadlinePassed, cn } from "@/lib/utils";
import { ITask, ALL_DOMAINS, Domain } from "@/types";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", domain],
    queryFn: () =>
      axios.get(`/api/tasks?limit=50${domain ? `&domain=${domain}` : ""}`).then((r) => (r.data.data as ITask[]) || []),
    refetchInterval: 10000, // Real-time updates every 10 seconds
  });

  const filtered = data?.filter((t) =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Tasks"
        description="Browse and submit your wildcard tasks"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="input pl-9"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="input pl-9 pr-8 appearance-none min-w-[180px]"
          >
            <option value="">All Domains</option>
            {ALL_DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-52 w-full rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="No tasks found"
          description="Try adjusting your search or domain filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task, i) => {
            const isPast = isDeadlinePassed(task.deadline);
            const isSoon = isDeadlineSoon(task.deadline);
            return (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/tasks/${task._id}`}>
                  <div className="card h-full flex flex-col group cursor-pointer">
                    {/* Domains */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {task.domains.map((d) => (
                        <DomainBadge key={d} domain={d} size="sm" />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors mb-2 line-clamp-2 flex-1">
                      {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-text-muted line-clamp-2 mb-4">
                      {task.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-text-muted" />
                        <span
                          className={cn(
                            "text-xs",
                            isPast ? "text-danger" : isSoon ? "text-warning" : "text-text-muted"
                          )}
                        >
                          {isPast ? "Closed" : `Due ${formatDate(task.deadline)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
