"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Megaphone } from "lucide-react";
import { AnnouncementTypeBadge } from "@/components/ui/Badges";
import { EmptyState, PageHeader } from "@/components/ui/Common";
import { formatRelative, formatDateTime } from "@/lib/utils";
import { IAnnouncement, IUser } from "@/types";

export default function AnnouncementsPage() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => axios.get("/api/announcements?limit=50").then((r) => (r.data.data as IAnnouncement[]) || []),
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader title="Announcements" description="Updates from the CCC team" />
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>
      ) : !announcements?.length ? (
        <EmptyState icon={<Megaphone className="h-8 w-8" />} title="No announcements" description="Check back soon for updates from the CCC team." />
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann._id} className="card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <AnnouncementTypeBadge type={ann.type} />
                <span className="text-xs text-text-muted">{formatRelative(ann.createdAt)}</span>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{ann.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
