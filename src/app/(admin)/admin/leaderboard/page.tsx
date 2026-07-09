"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Github, ExternalLink } from "lucide-react";
import { Avatar, PageHeader } from "@/components/ui/Common";
import { Skeleton } from "@/components/ui/Common";
import { IUser } from "@/types";

interface RankedUser extends IUser {
  rank: number;
}

export default function AdminLeaderboardPage() {
  const { data: students, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => axios.get("/api/leaderboard?limit=50").then((r) => r.data.data as RankedUser[]),
  });

  const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-text-muted">#{rank}</span>;
  };

  const podiumColors = ["bg-yellow-500/10 border-yellow-500/30", "bg-gray-400/10 border-gray-400/30", "bg-amber-600/10 border-amber-600/30"];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Leaderboard"
        description="Internal ranking based on points and completed tasks — admin only"
      />

      {/* Top 3 Podium */}
      {!isLoading && students && students.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {students.slice(0, 3).map((student, i) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`card text-center border ${podiumColors[i]} ${i === 0 ? "order-2" : i === 1 ? "order-1" : "order-3"}`}
            >
              <div className="flex justify-center mb-3">
                <RankIcon rank={i + 1} />
              </div>
              <Avatar name={student.name} src={student.avatar} size="lg" className="mx-auto mb-3" />
              <p className="font-semibold text-text-primary text-sm">{student.name}</p>
              <p className="text-xs text-text-muted">{student.studentNumber}</p>
              <p className="text-2xl font-bold text-accent mt-2">{student.totalPoints}</p>
              <p className="text-xs text-text-muted">pts · {student.completedTasks} tasks</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : !students?.length ? (
        <div className="text-center py-12 text-text-muted">No students yet</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Points</th>
                <th>Tasks</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <td className="w-12">
                    <div className="flex items-center justify-center">
                      <RankIcon rank={student.rank} />
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name} src={student.avatar} size="sm" />
                      <div>
                        <p className="font-medium text-text-primary text-sm">{student.name}</p>
                        <p className="text-xs text-text-muted">{student.studentNumber} · {student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-lg font-bold text-accent">{student.totalPoints}</span>
                  </td>
                  <td>
                    <span className="font-medium text-text-primary">{student.completedTasks}</span>
                    <span className="text-text-muted text-xs"> completed</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {student.github && (
                        <a href={student.github} target="_blank" rel="noopener noreferrer" className="btn-ghost p-1.5">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
