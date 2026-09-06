import type { Vehicle } from "@/interfaces/vehicle.interface";
import { buildVehicleTechnicalSpecs } from "../utils/build-vehicle-technical-specs";
import { VehicleDetailCard } from "./VehicleDetailCard";

interface VehicleDetailMainDataSectionProps {
  vehicle: Vehicle;
}

export const VehicleDetailMainDataSection = ({
  vehicle,
}: VehicleDetailMainDataSectionProps) => {
  const specs = buildVehicleTechnicalSpecs(vehicle);

  return (
    <VehicleDetailCard title="Datos principales">
      <dl className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-border/70 py-2.5 text-sm last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <dt className="text-muted-foreground">{spec.label}</dt>
            <dd className="text-right font-medium text-foreground">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </VehicleDetailCard>
  );
};
