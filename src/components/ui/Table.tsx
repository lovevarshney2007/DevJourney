"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { fadeUp, stagger } from "./motion";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, loading, emptyState, children, ...props }, ref) => {
    return (
      <div className={cn("w-full overflow-auto rounded-lg border border-border-hairline bg-bg-surface shadow-none", containerClassName)}>
        <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props}>
          {children}
        </table>
        {loading && (
          <div className="flex items-center justify-center p-8 text-text-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {!loading && emptyState && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            {emptyState}
          </div>
        )}
      </div>
    );
  }
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("sticky top-0 z-10 bg-bg-surface", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, HTMLMotionProps<"tbody">>(
  ({ className, ...props }, ref) => (
    <motion.tbody ref={ref} variants={stagger} initial="hidden" animate="visible" className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, HTMLMotionProps<"tr">>(
  ({ className, ...props }, ref) => (
    <motion.tr
      ref={ref}
      variants={fadeUp}
      className={cn(
        "border-b border-border-hairline transition-colors duration-100 hover:bg-bg-wash-mint data-[state=selected]:bg-bg-wash-violet",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          "h-11 px-4 text-left align-middle font-mono font-medium text-text-muted uppercase text-[11px] tracking-widest",
          sortable && "cursor-pointer select-none hover:text-text-primary transition-colors duration-100",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1.5">
          {children}
          {sortable && (
            <span className="flex flex-col text-text-muted">
              {sortDirection === "asc" ? (
                <ChevronUp className="h-3 w-3 text-accent-violet" />
              ) : sortDirection === "desc" ? (
                <ChevronDown className="h-3 w-3 text-accent-violet" />
              ) : (
                <ChevronsUpDown className="h-3 w-3 opacity-50" />
              )}
            </span>
          )}
        </div>
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0 text-text-primary text-sm font-medium", className)}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border-hairline bg-bg-surface">
      <span className="text-sm text-text-secondary">
        Page <strong className="text-text-primary">{currentPage}</strong> of <strong className="text-text-primary">{totalPages}</strong>
      </span>
      <div className="flex gap-2">
        <button
          className="btn-secondary btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="btn-secondary btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
