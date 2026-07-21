"use client";

import { cn } from "@/lib/utils";
import { VehicleType } from "@/interfaces/vehicle.interface";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { Check } from "lucide-react";

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
    <div className="grid grid-cols-3 gap-1">
      {vehicleTypes.map((vehicleType) => {
        const active = value === vehicleType.slug;

        return (
          <button
            key={vehicleType.id}
            type="button"
            onClick={() => onChange(active ? undefined : vehicleType.slug)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 border p-0 rounded-sm overflow-hidden cursor-pointer hover:bg-muted/50 hover:border-primary",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "",
            )}
          >
            {vehicleType.image_url && (
              <div
                className={cn(
                  "flex h-16 w-full items-center justify-center  overflow-hidden relative",
                  active ? "bg-white/15" : "bg-muted group-hover:bg-primary/5",
                )}
              >
                <WiautoImage
                  sizes="100px"
                  unoptimized={false}
                  src={vehicleType.image_url}
                  alt={vehicleType.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1   flex items-center justify-between">
              <p className="text-xs font-medium max-w-full truncate">{vehicleType.name}</p>
              {active && <Check className="h-4 w-4 shrink-0" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};
