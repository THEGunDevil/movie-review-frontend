"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // If only one page or less, don't render pagination
  if (totalPages <= 1) return null;

  // Build an array of page numbers to display (with possible ellipsis)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5; // how many page buttons to show

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push("ellipsis");
      }

      // Pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="h-9 w-9 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === "ellipsis") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-slate-500"
              >
                ...
              </span>
            );
          }

          const isActive = p === page;
          return (
            <Button
              key={p}
              variant={isActive ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 text-sm font-medium ${
                isActive
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {p}
              <span className="sr-only">Page {p}</span>
            </Button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-9 w-9 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </nav>
  );
}