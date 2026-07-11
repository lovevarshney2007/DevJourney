"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
            retry: 1,
            refetchOnWindowFocus: false, // Prevents excessive refetching
            refetchOnReconnect: true,
            refetchOnMount: false, // Relies on staleTime
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  useEffect(() => {
    // Setup Server-Sent Events (SSE) listener
    const eventSource = new EventSource("/api/events");

    const invalidateAll = () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    };

    eventSource.addEventListener("task_update", invalidateAll);
    eventSource.addEventListener("submission_update", invalidateAll);
    eventSource.addEventListener("announcement_update", invalidateAll);
    
    // Auto-reconnect is handled natively by browser EventSource.
    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fafafa",
            border: "1px solid #27272a",
            borderRadius: "8px",
            fontSize: "13px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#18181b" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#18181b" },
          },
        }}
      />
    </QueryClientProvider>
  );
}
