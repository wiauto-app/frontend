"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VehicleType } from "@/interfaces/vehicle.interface";

type VehicleTypeSelectorProps = {
  vehicleTypes: VehicleType[];
  value?: string;
  onChange: (slug?: string) => void;
};

export const VehicleTypeSelector = ({
  vehicleTypes,
  value,
  onChange,
}: VehicleTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {vehicleTypes.map((vehicleType) => {
        const active = value === vehicleType.slug;
        return (
          <Button
            key={vehicleType.id}
            type="button"
            variant="outline"
            size="lg"
            className={cn(
              active && "border-primary text-primary",
            )}
            onClick={() => onChange(active ? undefined : vehicleType.slug)}
          >
            {vehicleType.name}
          </Button>
        );
      })}
    </div>
  );
};
