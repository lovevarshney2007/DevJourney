"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";
import { Skeleton } from "@/components/ui/Common";
import { Download } from "lucide-react";

// Set worker URL for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface FileViewerProps {
  url: string;
}

export function FileViewer({ url }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  const isPdf = url.toLowerCase().includes(".pdf");
  const isDocx = url.toLowerCase().includes(".docx") || url.toLowerCase().includes(".doc");

  useEffect(() => {
    if (isDocx) {
      setLoading(true);
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((buffer) => mammoth.convertToHtml({ arrayBuffer: buffer }))
        .then((result) => {
          setHtmlContent(result.value);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load document preview");
          setLoading(false);
        });
    }
  }, [url, isDocx]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Subtract some padding to ensure it fits nicely
        setContainerWidth(entry.contentRect.width - 32);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError() {
    setError("Failed to load PDF");
    setLoading(false);
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-bg-wash-violet text-text-muted p-6 text-center">
        <p>{error}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm mt-4 inline-block mx-auto">
          Download to view
        </a>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-[600px] overflow-y-auto bg-white rounded-xl relative custom-scrollbar flex flex-col"
    >
      <div className="sticky top-4 right-4 z-10 flex justify-end w-full mb-[-40px] pr-4 pt-4 pointer-events-none">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="pointer-events-auto flex items-center gap-2 bg-slate-900/60 hover:bg-slate-900/80 text-white px-3 py-1.5 rounded-lg backdrop-blur-md transition-all text-sm font-medium shadow-sm"
          title="Download File"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>

      {loading && isDocx && (
        <div className="p-8 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      )}

      {isPdf && (
        <div className="flex flex-col items-center py-4 relative min-h-full">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="p-8 w-full max-w-3xl space-y-4 mx-auto">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            }
            className="flex flex-col gap-4 max-w-full"
          >
            {Array.from(new Array(numPages || 0), (el, index) => (
              <div key={`page_${index + 1}`} className="shadow-md border border-gray-200">
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={containerWidth ? Math.min(containerWidth, 1000) : undefined}
                  className="max-w-full"
                />
              </div>
            ))}
          </Document>
        </div>
      )}

      {isDocx && htmlContent && (
        <div 
          className="p-8 prose prose-sm max-w-none text-black"
          dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
      )}

      {!isPdf && !isDocx && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-bg-wash-violet text-text-muted p-6">
          <p>Preview not available for this file type.</p>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm mt-4">
            Download File
          </a>
        </div>
      )}
    </div>
  );
}
