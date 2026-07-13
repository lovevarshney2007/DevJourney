"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Search, Users, ChevronRight, Trash2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, EmptyState, PageHeader, Skeleton } from "@/components/ui/Common";
import { IUser } from "@/types";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["students", search],
    queryFn: () => axios.get(`/api/students?limit=100${search ? `&search=${search}` : ""}`).then((r) => (r.data.data as IUser[]) || []),
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/students/${id}`);
      toast.success("User deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

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
                <th>IPs</th>
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
                    {student.ipAddresses && student.ipAddresses.length > 0 ? (
                      <div className="flex flex-col gap-1 text-xs">
                        {student.ipAddresses.slice(0, 2).map(ip => (
                          <span key={ip} className="font-mono text-text-secondary">{ip}</span>
                        ))}
                        {student.ipAddresses.length > 2 && (
                          <span className="text-[10px] text-accent-violet">+{student.ipAddresses.length - 2} more</span>
                        )}
                        {student.ipAddresses.length > 1 && (
                          <ShieldAlert className="h-3.5 w-3.5 text-warning inline-block ml-1" title="Multiple IPs detected" />
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-text-muted">None</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/students/${student._id}`} className="btn-ghost btn-sm">
                        View <ChevronRight className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(student._id)} className="btn-ghost btn-sm text-danger hover:bg-danger/10 p-2 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
