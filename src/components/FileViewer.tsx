"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";
import { Skeleton } from "@/components/ui/Common";

// Set worker URL for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface FileViewerProps {
  url: string;
}

export function FileViewer({ url }: FileViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="w-full h-[600px] overflow-y-auto bg-white rounded-xl relative custom-scrollbar">
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
                  width={Math.min(window.innerWidth - 80, 800)}
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
