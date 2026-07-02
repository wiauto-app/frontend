"use client";

import { VehicleListCard } from "@/app/(public)/vehiculos/components/VehicleListCard";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { Car, SearchCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AssistantVehiclesListingProps {
  vehicles: VehicleListItem[];
  total: number;
  appliedFilters?: Record<string, unknown>;
  hasSearch?: boolean;
  selectedVehicleId?: string;
  onSelectVehicle?: (vehicleId: string) => void;
}

export const AssistantVehiclesListing = ({
  vehicles,
  total,
  hasSearch = false,
  selectedVehicleId,
  onSelectVehicle,
}: AssistantVehiclesListingProps) => {
  if (!hasSearch) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <Car className="size-12 text-slate-300" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">
          Busca vehículos en el chat para ver resultados aquí
        </p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <Car className="size-12 text-slate-300" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">
          No se encontraron vehículos con esos criterios.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <SearchCheck className="size-5 text-primary" aria-hidden />
        {total} resultado{total === 1 ? "" : "s"}
        {total > vehicles.length ? ` (mostrando ${vehicles.length})` : ""}
      </p>

      <div className="flex flex-col gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={cn(
              "rounded-2xl transition-shadow",
              selectedVehicleId === vehicle.id &&
                "ring-2 ring-primary ring-offset-2",
            )}
            onClick={() => onSelectVehicle?.(vehicle.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectVehicle?.(vehicle.id);
              }
            }}
            role={onSelectVehicle ? "button" : undefined}
            tabIndex={onSelectVehicle ? 0 : undefined}
            aria-label={
              onSelectVehicle
                ? `Seleccionar vehículo ${vehicle.version_summary.model_name}`
                : undefined
            }
          >
            <VehicleListCard vehicle={vehicle} />
          </div>
        ))}
      </div>

      {total > vehicles.length && (
        <Link
          href="/vehiculos"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver más en el catálogo
        </Link>
      )}
    </div>
  );
};
