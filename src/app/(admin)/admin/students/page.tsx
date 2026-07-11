"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Search, Users, ChevronRight } from "lucide-react";
import { Avatar, EmptyState, PageHeader, Skeleton } from "@/components/ui/Common";
import { IUser } from "@/types";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["students", search],
    queryFn: () => axios.get(`/api/students?limit=100${search ? `&search=${search}` : ""}`).then((r) => (r.data.data as IUser[]) || []),
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader title="Students" description="All registered CCC AKGEC students" />

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or student number..."
          className="input pl-9 max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
      ) : !data?.length ? (
        <EmptyState icon={<Users className="h-8 w-8" />} title="No students found" description="No students match your search." />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student Number</th>
                <th>Points</th>
                <th>Tasks Done</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name} src={student.avatar} size="sm" />
                      <div>
                        <p className="font-medium text-text-primary text-sm">{student.name}</p>
                        <p className="text-xs text-text-muted">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="font-mono text-sm text-text-secondary">{student.studentNumber}</span></td>
                  <td><span className="font-semibold text-accent">{student.totalPoints}</span></td>
                  <td><span className="text-text-primary">{student.completedTasks}</span></td>
                  <td className="text-xs text-text-muted">{new Date(student.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/students/${student._id}`} className="btn-ghost btn-sm">
                      View <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
