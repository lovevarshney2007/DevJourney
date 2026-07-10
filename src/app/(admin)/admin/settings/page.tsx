"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Download, FileSpreadsheet, Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/Common";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // We will fetch all students to generate a leaderboard CSV
      const { data } = await axios.get("/api/students?limit=1000"); // fetch up to 1000 students
      const students = data.data;

      if (!students || students.length === 0) {
        toast.error("No student data available to export");
        return;
      }

      // Convert to CSV
      const headers = ["Rank", "Name", "Student Number", "Email", "Completed Tasks", "Total Points"];
      const csvRows = [headers.join(",")];

      students.forEach((s: any, i: number) => {
        csvRows.push([
          i + 1,
          `"${s.name}"`,
          s.studentNumber,
          s.email,
          s.completedTasks || 0,
          s.totalPoints || 0
        ].join(","));
      });

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `devjourney_students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export successful!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Admin Settings" 
        subtitle="Manage platform settings and export data"
      />

      <div className="card space-y-6">
        <div className="flex items-start gap-4 pb-6 border-b border-border">
          <div className="p-3 bg-accent/10 rounded-xl">
            <FileSpreadsheet className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary">Export Student Data</h3>
            <p className="text-sm text-text-muted mt-1">
              Download a complete CSV report of all students, their total points, and completed tasks. Useful for college reporting.
            </p>
          </div>
          <Button 
            onClick={handleExportData} 
            loading={isExporting} 
            variant="primary"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Download CSV
          </Button>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-bg-hover border border-border rounded-xl">
            <SettingsIcon className="h-6 w-6 text-text-muted" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary">Platform Settings</h3>
            <p className="text-sm text-text-muted mt-1">
              More admin settings (like adding other admins) will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
