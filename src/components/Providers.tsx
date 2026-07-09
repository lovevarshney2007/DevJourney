"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#16161e",
            color: "#f1f5f9",
            border: "1px solid #2a2a3a",
            borderRadius: "8px",
            fontSize: "13px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#16161e" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#16161e" },
          },
        }}
      />
    </QueryClientProvider>
  );
}
