"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Table, File, ArrowLeft, CheckCircle,
  AlertTriangle, ChevronRight, Download, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Common";
import { DomainBadge } from "@/components/ui/Badges";
import { ImportedTask } from "@/types";
import { formatDate } from "@/lib/utils";

type Step = "upload" | "preview" | "success";

const TEMPLATE_URL_NOTE = "Download the Excel template, fill it in, then upload here.";

function generateExcelTemplate() {
  const headers = ["title", "description", "domains", "deadline", "points", "resourceTitle", "resourceUrl"];
  const example = [
    "Build a REST API",
    "Create a REST API using Node.js and Express with MongoDB integration. Implement CRUD operations for a resource of your choice.",
    "Backend,Cloud Computing",
    "2025-12-31",
    "100",
    "Node.js Docs",
    "https://nodejs.org/docs",
  ];
  const csv = [headers.join(","), example.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "devjourney_tasks_template.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Template downloaded as CSV");
}

export default function ImportTasksPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [previewData, setPreviewData] = useState<{ tasks: ImportedTask[]; errors: string[]; source: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const parseFile = async (file: File) => {
    setParsing(true);
    setSelectedFile(file);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("action", "preview");
      const res = await axios.post("/api/import/tasks", fd);
      setPreviewData(res.data.data);
      setStep("preview");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Parse failed");
      }
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await parseFile(file);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await parseFile(file);
  };

  const confirmImport = async () => {
    if (!previewData || !selectedFile) return;
    setConfirming(true);
    try {
      const fd = new FormData();
      fd.append("action", "confirm");
      fd.append("previewData", JSON.stringify(previewData.tasks));
      fd.append("source", previewData.source);
      const res = await axios.post("/api/import/tasks", fd);
      toast.success(res.data.message);
      setStep("success");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Import failed");
      }
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="btn-ghost mb-6 -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </button>

      <PageHeader
        title="Import Tasks"
        description="Bulk import tasks from Excel, Word, or PDF documents"
      />

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(["upload", "preview", "success"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border transition-colors ${
              step === s ? "bg-accent border-accent text-white" :
              (["upload", "preview", "success"].indexOf(step) > i) ? "bg-success/20 border-success text-success" :
              "bg-bg-hover border-border text-text-muted"
            }`}>
              {["upload", "preview", "success"].indexOf(step) > i ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-sm capitalize text-text-muted">{s}</span>
            {i < 2 && <ChevronRight className="h-4 w-4 text-border" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Supported formats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { icon: <Table className="h-5 w-5" />, label: "Excel", ext: ".xlsx, .xls", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                { icon: <FileText className="h-5 w-5" />, label: "Word Doc", ext: ".docx, .doc", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { icon: <File className="h-5 w-5" />, label: "PDF", ext: ".pdf", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              ].map((f) => (
                <div key={f.label} className={`card border ${f.bg} text-center`}>
                  <div className={`mx-auto mb-2 ${f.color}`}>{f.icon}</div>
                  <p className="text-sm font-medium text-text-primary">{f.label}</p>
                  <p className="text-xs text-text-muted">{f.ext}</p>
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center gap-4 p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                dragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/40 bg-bg-hover"
              }`}
            >
              {parsing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 text-accent animate-spin" />
                  <p className="text-text-secondary">Parsing file...</p>
                </div>
              ) : (
                <>
                  <Upload className={`h-10 w-10 ${dragging ? "text-accent" : "text-text-muted"}`} />
                  <div className="text-center">
                    <p className="text-text-primary font-medium">Drop file here or click to browse</p>
                    <p className="text-text-muted text-sm mt-1">Supports .xlsx, .docx, .pdf — max 50MB</p>
                  </div>
                </>
              )}
              <input type="file" accept=".xlsx,.xls,.docx,.doc,.pdf" className="hidden" onChange={handleFileChange} disabled={parsing} />
            </label>

            {/* Template download */}
            <div className="mt-5 p-4 rounded-xl bg-accent/5 border border-accent/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">Excel Template</p>
                  <p className="text-xs text-text-muted mt-0.5">{TEMPLATE_URL_NOTE}</p>
                </div>
                <button onClick={generateExcelTemplate} className="btn-secondary btn-sm flex-shrink-0">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Doc/PDF Format guide */}
            <div className="mt-4 p-4 rounded-xl bg-bg-hover border border-border">
              <p className="text-xs font-semibold text-text-secondary mb-2">Word/PDF Format (use task blocks):</p>
              <pre className="text-xs text-text-muted font-mono leading-relaxed overflow-x-auto">
{`TASK START
Title: Build a REST API
Description: Create a full REST API with authentication...
Domains: Backend, Cloud Computing
Deadline: 2025-12-31
Points: 100
TASK END

TASK START
Title: Next Task...
TASK END`}
              </pre>
            </div>
          </motion.div>
        )}

        {step === "preview" && previewData && (
          <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Errors */}
            {previewData.errors.length > 0 && (
              <div className="mb-5 p-4 rounded-xl bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <p className="text-sm font-medium text-warning">{previewData.errors.length} parse error(s)</p>
                </div>
                <ul className="space-y-1">
                  {previewData.errors.map((e, i) => (
                    <li key={i} className="text-xs text-warning/80">• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">{previewData.tasks.length}</span> tasks ready to import
              </p>
              <button onClick={() => setStep("upload")} className="btn-ghost btn-sm">
                <X className="h-4 w-4" />
                Start over
              </button>
            </div>

            {/* Task Preview List */}
            <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {previewData.tasks.map((task, i) => (
                <div key={i} className="card-flat">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold text-accent bg-accent/10 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary text-sm">{task.title}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {task.domains.map((d) => <DomainBadge key={d} domain={d} size="sm" />)}
                        <span className="text-[11px] text-text-muted">Due {formatDate(task.deadline)}</span>
                        <span className="text-[11px] font-semibold text-accent">{task.points}pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep("upload")}>Back</Button>
              <Button
                loading={confirming}
                onClick={confirmImport}
                className="flex-1"
                disabled={previewData.tasks.length === 0}
              >
                Import {previewData.tasks.length} Tasks
              </Button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex p-4 rounded-full bg-success/10 border border-success/20 mb-4">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Tasks Imported!</h2>
            <p className="text-text-muted mb-8">All tasks have been saved as drafts. Publish them when ready.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => { setStep("upload"); setPreviewData(null); }}>Import More</Button>
              <Button onClick={() => router.push("/admin/tasks")}>View All Tasks</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
