"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND_BLUE } from "../constants";

type VehiclesPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function VehiclesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: VehiclesPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => {
    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
  });

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="Paginación de vehículos"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page, index) => {
        const prevPage = pages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="px-1 text-slate-400">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                page === currentPage
                  ? "text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50",
              )}
              style={page === currentPage ? { backgroundColor: BRAND_BLUE } : undefined}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {String(page).padStart(2, "0")}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página siguiente"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
