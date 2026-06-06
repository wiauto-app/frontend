"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { NewsPaginatedResult } from "../types/news.types";
import { NewsPageButton } from "./NewsPageButton";

type NewsPaginationProps = {
  pagination: NewsPaginatedResult["pagination"];
};

const MAX_VISIBLE_PAGES = 5;

const getVisiblePages = (
  currentPage: number,
  pageCount: number,
): number[] => {
  if (pageCount <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(pageCount, start + MAX_VISIBLE_PAGES - 1);

  if (end - start + 1 < MAX_VISIBLE_PAGES) {
    start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export const NewsPagination = ({ pagination }: NewsPaginationProps) => {
  const { page, page_count: pageCount } = pagination;

  if (pageCount <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(page, pageCount);
  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  return (
    <nav
      aria-label="Paginación de noticias"
      className="mt-20 flex items-center justify-center gap-2"
    >
      <NewsPageButton
        page={page - 1}
        isActive={false}
        disabled={isFirstPage}
        variant="nav"
        ariaLabel="Página anterior"
      >
        <ArrowLeft className="h-4 w-4" />
      </NewsPageButton>

      {visiblePages.map((pageNumber) => (
        <NewsPageButton
          key={pageNumber}
          page={pageNumber}
          isActive={pageNumber === page}
          ariaLabel={`Ir a la página ${pageNumber}`}
        >
          {String(pageNumber).padStart(2, "0")}
        </NewsPageButton>
      ))}

      <NewsPageButton
        page={page + 1}
        isActive={false}
        disabled={isLastPage}
        variant="nav"
        ariaLabel="Página siguiente"
      >
        <ArrowRight className="h-4 w-4" />
      </NewsPageButton>
    </nav>
  );
};
