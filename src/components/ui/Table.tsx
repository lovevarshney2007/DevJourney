"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ChevronsUpDown, Loader2 } from "lucide-react";
import React from "react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, loading, emptyState, children, ...props }, ref) => {
    return (
      <div className={cn("w-full overflow-auto rounded-xl border border-border bg-bg-surface shadow-sm", containerClassName)}>
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
    <thead ref={ref} className={cn("sticky top-0 z-10 bg-bg/90 backdrop-blur-[2px]", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border transition-colors hover:bg-bg-hover/50 data-[state=selected]:bg-accent/10",
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
          "h-11 px-4 text-left align-middle font-medium text-text-secondary uppercase text-[11px] tracking-wider",
          sortable && "cursor-pointer select-none hover:text-text-primary transition-colors",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-1.5">
          {children}
          {sortable && (
            <span className="flex flex-col text-text-muted">
              {sortDirection === "asc" ? (
                <ChevronUp className="h-3 w-3 text-accent" />
              ) : sortDirection === "desc" ? (
                <ChevronDown className="h-3 w-3 text-accent" />
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
    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg-surface">
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
