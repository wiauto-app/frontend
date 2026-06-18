"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BRAND_BLUE } from "../constants";

type DealersPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function DealersPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DealersPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="Paginación de concesionarios"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed"
        aria-label="Página anterior"
        id="dealers-prev-page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, index) => {
        const prevPage = pages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="px-1 text-slate-400">…</span>}
            <Button
              type="button"
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                "size-10 rounded-full",
                page === currentPage
                  ? ""
                  : "border-slate-200 text-slate-600 hover:bg-slate-50",
              )}
              style={
                page === currentPage ? { backgroundColor: BRAND_BLUE } : undefined
              }
              aria-current={page === currentPage ? "page" : undefined}
              id={`dealers-page-${page}`}
            >
              {page}
            </Button>
          </span>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed"
        aria-label="Página siguiente"
        id="dealers-next-page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
