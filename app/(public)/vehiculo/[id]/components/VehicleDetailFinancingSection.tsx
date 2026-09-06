import Link from "next/link";
import { Calculator } from "lucide-react";

import { formatPrice, getVehicleDisplayPrices } from "@/app/(public)/vehiculos/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import { cn } from "@/lib/utils";
import { VehicleDetailCard } from "./VehicleDetailCard";
import { FinancingSelector } from "./financingSelector";

interface VehicleDetailFinancingSectionProps {
  vehicle: Vehicle;
}

export const VehicleDetailFinancingSection = ({
  vehicle,
}: VehicleDetailFinancingSectionProps) => {
  const { current_price } = getVehicleDisplayPrices(
    vehicle.prices ?? vehicle.vehicle_prices ?? [],
    vehicle.price,
  );

  return (
    <VehicleDetailCard title="Financiación">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Calculator className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-semibold text-foreground">
              Financia tu vehículo desde {formatPrice(current_price)}
            </p>
            <div className="mt-1">
              <FinancingSelector
                current_price={current_price}
                cuotas={vehicle.cuotas}
              />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Calcula una cuota orientativa según el plazo que prefieras.
            </p>
          </div>
        </div>
        <Link
          href={`/simulador-financiamiento?vehicleId=${vehicle.id}`}
          className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
        >
          Simular financiación
        </Link>
      </div>
    </VehicleDetailCard>
  );
};
