"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import type { DealershipListItem } from "@/services/dealerships/types/dealership.types";
import { ConcesionariaCard } from "./ConcesionariaCard";
import { DealersPagination } from "./DealersPagination";
import { ConcesionariasToolbar } from "./ConcesionariasToolbar";
import { Button } from "@/components/ui/button";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import {
  DEALER_FILTER_KEYS,
  DEALER_FILTER_KEYS_LIST,
} from "../constants/filterKeys.constants";

type ConcesionariasPageContentProps = {
  dealers: DealershipListItem[];
  total: number;
  page: number;
  limit: number;
};

export function ConcesionariasPageContent({
  dealers,
  total,
  page,
  limit,
}: ConcesionariasPageContentProps) {
  const router = useRouter();
  const { applyUrlUpdates, handleClearAll } = useFiltersManager({
    keys: DEALER_FILTER_KEYS_LIST,
  });

  const totalPages = Math.ceil(total / limit) || 1;

  const handlePageChange = (nextPage: number) => {
    applyUrlUpdates({
      [DEALER_FILTER_KEYS.PAGE]: nextPage > 1 ? String(nextPage) : undefined,
    });
    router.refresh();
  };

  const handleClearFilters = () => {
    handleClearAll();
    router.refresh();
  };

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
            onClick={handleClearFilters}
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
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
