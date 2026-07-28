"use client";

import { Button } from "@/components/ui/button";

interface MyListingsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const MyListingsPagination = ({
  page,
  totalPages,
  onPageChange,
}: MyListingsPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        Anterior
      </Button>
      <span className="text-sm text-gray-600">
        Página {page} de {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Página siguiente"
      >
        Siguiente
      </Button>
    </div>
  );
};
