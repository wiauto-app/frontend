import { BadgeCheck, ShieldCheck } from "lucide-react";

import type { Vehicle } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";

interface VehicleDetailWarrantySectionProps {
  vehicle: Vehicle;
}

export const VehicleDetailWarrantySection = ({
  vehicle,
}: VehicleDetailWarrantySectionProps) => (
  <VehicleDetailCard title="Garantías">
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
        <ShieldCheck className="size-6 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Garantía del vehículo
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {vehicle.warranty_type?.name ?? "Consulta las condiciones con el anunciante"}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
        <BadgeCheck className="size-6 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Garantía de la marca
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {vehicle.by_brand_warranty ? "Incluida" : "No incluida"}
          </p>
        </div>
      </div>
    </div>
  </VehicleDetailCard>
);
