"use client";

import { Building2 } from "lucide-react";
import type { DealerListItem } from "../interfaces";
import { ConcesionariaCard } from "./ConcesionariaCard";
import { DealersPagination } from "./DealersPagination";
import { ConcesionariasToolbar } from "./ConcesionariasToolbar";
import { useDealersListingFilters } from "../hooks/useDealersListingFilters";
import { Button } from "@/components/ui/button";

type ConcesionariasPageContentProps = {
  dealers: DealerListItem[];
  total: number;
};

export function ConcesionariasPageContent({
  dealers,
  total,
}: ConcesionariasPageContentProps) {
  const { filters, resetFilters, goToPage } = useDealersListingFilters();

  const totalPages = Math.ceil(total / (filters.limit || 12));
  const currentPage = filters.page ?? 1;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      <ConcesionariasToolbar total={total} />

      {dealers.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
          <Building2 className="mx-auto size-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No se encontraron concesionarios
          </h3>
          <p className="mt-2 text-slate-500">
            Intenta ajustar los filtros o realizar una nueva búsqueda
          </p>
          <Button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-[#0061F2] px-4 py-2 font-semibold text-white hover:opacity-90"
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {dealers.map((dealer) => (
              <ConcesionariaCard key={dealer.id} dealer={dealer} />
            ))}
          </div>

          <DealersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}
