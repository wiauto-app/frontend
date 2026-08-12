"use client";

import { cn } from "@/lib/utils";
import { VehicleType } from "@/interfaces/vehicle.interface";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VehicleTypeSelectorProps = {
  vehicleTypes: VehicleType[];
  value?: string;
  onChange: (slug?: string | null) => void;
};

export const VehicleTypeSelector = ({
  vehicleTypes,
  value,
  onChange,
}: VehicleTypeSelectorProps) => {
  return (
    <Select
      items={vehicleTypes.map((vehicleType) => ({
        label: vehicleType.name,
        value: vehicleType.slug,
      }))}
      onValueChange={(next) => onChange(next ?? null)}
      value={value}
    >
      <SelectTrigger className={cn("w-full")}>
        <SelectValue placeholder="Tipo de vehículo" />
      </SelectTrigger>
      <SelectContent>
        {vehicleTypes.map((vehicleType) => (
          <SelectItem
            className={cn("cursor-pointer h-8")}
            key={vehicleType.slug}
            value={vehicleType.slug}
          >
            <div className="flex items-center gap-2">
              {vehicleType.image_url && (
                <WiautoImage
                  src={vehicleType.image_url}
                  alt={vehicleType.name}
                  width={20}
                  height={20}
                  sizes="20px"
                  className="rounded-full object-cover"
                />
              )}
              <span>{vehicleType.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
