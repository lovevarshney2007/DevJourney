"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Trophy, Search, Medal, Target } from "lucide-react";
import { PageHeader, Skeleton, Avatar } from "@/components/ui/Common";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { IUser } from "@/types";

export default function AdminLeaderboardPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-leaderboard", search],
    queryFn: () => axios.get(`/api/students?search=${search}&limit=50`).then((r) => r.data.data as IUser[]),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Leaderboard" 
        subtitle="Top performing students across all domains"
        action={
          <div className="w-72">
            <Input 
              placeholder="Search students..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        }
      />

      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-16 text-center">Rank</th>
                  <th>Student</th>
                  <th>Student Number</th>
                  <th className="text-center">Tasks Completed</th>
                  <th className="text-right">Total Points</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((student, index) => (
                  <tr key={student._id} className={index < 3 ? "bg-accent/5" : ""}>
                    <td className="text-center font-bold">
                      {index === 0 && <Medal className="h-6 w-6 text-yellow-500 mx-auto" />}
                      {index === 1 && <Medal className="h-6 w-6 text-gray-400 mx-auto" />}
                      {index === 2 && <Medal className="h-6 w-6 text-amber-600 mx-auto" />}
                      {index > 2 && <span className="text-text-muted">#{index + 1}</span>}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} src={student.avatar} size="sm" />
                        <div>
                          <p className="font-semibold text-text-primary">{student.name}</p>
                          <p className="text-xs text-text-muted">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{student.studentNumber}</td>
                    <td className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-bg-hover">
                        <Target className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium">{student.completedTasks || 0}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent/10 border border-accent/20">
                        <Trophy className="h-4 w-4 text-accent" />
                        <span className="font-bold text-accent">{student.totalPoints || 0}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {data?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-text-muted">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
