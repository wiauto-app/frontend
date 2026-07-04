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
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {vehicleTypes.map((vehicleType) => {
        const active = value === vehicleType.slug;

        return (
          <button
            key={vehicleType.id}
            type="button"
            onClick={() => onChange(active ? undefined : vehicleType.slug)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl border text-left transition-all",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border hover:border-primary/30 hover:bg-muted/50",
            )}
          >
            {vehicleType.image_url && (
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-lg overflow-hidden relative",
                  active ? "bg-white/15" : "bg-muted group-hover:bg-primary/5",
                )}
              >
                <WiautoImage
                  sizes="100px"
                  
                  src={vehicleType.image_url}
                  alt={vehicleType.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1  px-3 py-2.5 flex items-center justify-between">
              <p className="text-sm font-medium">{vehicleType.name}</p>
            {active && <Check className="h-4 w-4 shrink-0" />}
            </div>

          </button>
        );
      })}
    </div>
  );
};
