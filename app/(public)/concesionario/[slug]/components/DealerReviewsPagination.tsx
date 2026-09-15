"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type DealerReviewsPaginationProps = {
  currentPage: number;
  totalPages: number;
};

const buildVisiblePages = (
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis-start" | "ellipsis-end"> => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("ellipsis-start");
  }

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);
  return pages;
};

export function DealerReviewsPagination({
  currentPage,
  totalPages,
}: DealerReviewsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const visible_pages = buildVisiblePages(currentPage, totalPages);

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("reviews_page");
    } else {
      params.set("reviews_page", String(page));
    }

    const query = params.toString();
    const href = `${pathname}${query ? `?${query}` : ""}#reviews`;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  };

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginación de reseñas"
      aria-busy={isPending}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Página anterior"
        disabled={currentPage <= 1 || isPending}
        onClick={() => navigateToPage(currentPage - 1)}
      >
        <ChevronLeft aria-hidden />
      </Button>

      {visible_pages.map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
            type="button"
            variant={item === currentPage ? "default" : "outline"}
            size="icon-sm"
            aria-label={`Ir a la página ${item}`}
            aria-current={item === currentPage ? "page" : undefined}
            disabled={isPending}
            onClick={() => navigateToPage(item)}
          >
            {item}
          </Button>
        ) : (
          <span
            key={item}
            className="px-1 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ),
      )}

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Página siguiente"
        disabled={currentPage >= totalPages || isPending}
        onClick={() => navigateToPage(currentPage + 1)}
      >
        <ChevronRight aria-hidden />
      </Button>
    </nav>
  );
}
