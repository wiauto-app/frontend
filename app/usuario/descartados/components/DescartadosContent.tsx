"use client";

import { EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DismissedVehicleCard } from "./DismissedVehicleCard";
import { useDismissedVehiclesPage } from "../hooks/useDismissedVehiclesPage";

export const DescartadosContent = () => {
  const {
    items,
    isLoading,
    isFetching,
    error,
    restore,
    restoringVehicleId,
  } = useDismissedVehiclesPage();

  const handleRestore = async (vehicleId: string) => {
    try {
      await restore(vehicleId);
      toast.success("Vehículo restaurado");
    } catch {
      toast.error("No se pudo restaurar el vehículo");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="mb-4 flex items-center gap-2">
        <EyeOff className="size-6 text-gray-700" aria-hidden />
        <h1 className="text-2xl font-bold text-gray-900">Descartados</h1>
      </div>

      <section aria-labelledby="dismissed-list-heading">
        <h2 id="dismissed-list-heading" className="sr-only">
          Vehículos descartados
        </h2>

        {error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            No se pudieron cargar tus vehículos descartados.
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        ) : !items.length ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <EyeOff className="mb-3 size-10 text-gray-300" aria-hidden />
            <p className="text-base font-medium text-gray-900">
              No hay vehículos descartados
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Los anuncios que descartes dejarán de aparecer en tus listados.
            </p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {isFetching && !isLoading ? (
              <div className="absolute top-0 right-0 flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Actualizando
              </div>
            ) : null}

            {items.map((item) => (
              <DismissedVehicleCard
                key={item.id || item.vehicle_id}
                item={item}
                onRestore={handleRestore}
                isRestoring={restoringVehicleId === item.vehicle_id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
