"use client";

import { VehicleGridCard } from "@/app/(public)/vehiculos/components/VehicleGridCard";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { SearchCheck } from "lucide-react";
import Link from "next/link";

export type { SearchVehiclesToolOutput } from "./utils/extractLatestSearchVehicles";

interface AssistantVehicleResultsProps {
  total: number;
  vehicles: VehicleListItem[];
}

export const AssistantVehicleResults = ({
  total,
  vehicles,
}: AssistantVehicleResultsProps) => {
  if (vehicles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No se encontraron vehículos con esos criterios.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        <SearchCheck className="text-primary size-7" />
        {total} resultado{total === 1 ? "" : "s"} encontrado
        {total === 1 ? "" : "s"}
        {total > vehicles.length
          ? ` (mostrando ${vehicles.length})`
          : ""}
      </p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {vehicles.map((vehicle) => (
          <VehicleGridCard key={vehicle.id} vehicle={vehicle} />
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
