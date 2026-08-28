"use client";
import {
  formatPrice,
  getVehicleDisplayPrices,
} from "@/app/(public)/vehiculos/utils";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import type { VehiclePriceHistoryItem } from "@/interfaces/vehicle-price.interface";
import { FinancingSelector } from "./financingSelector";
import { Leaf, Palette, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type VehicleDetailPricingSectionProps = {
  vehicle: Vehicle;
};

const getVehiclePriceHistory = (vehicle: Vehicle): VehiclePriceHistoryItem[] =>
  vehicle.prices ?? vehicle.vehicle_prices ?? [];

export const VehicleDetailPricingSection = ({
  vehicle,
}: VehicleDetailPricingSectionProps) => {
  const price_history = getVehiclePriceHistory(vehicle);
  const { current_price, previous_price } = getVehicleDisplayPrices(
    price_history,
    vehicle.price,
  );
  const dgt_label = vehicle.dgt_label?.name ?? vehicle.dgt_label?.code ?? null;

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-muted-foreground text-sm font-medium">Precio al contado</p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-bold tracking-tight ">
            {formatPrice(current_price)}
          </span>
          {previous_price ? (
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(previous_price)}
            </span>
          ) : null}
          <Badge className="bg-green-500/20 text-green-600">Buen precio</Badge>
        </div>
        <p className="text-green-600">IVA incluido</p>
      </div>
      <div className="flex items-center gap-5 text-muted-foreground">
        <FinancingSelector
          current_price={current_price}
          cuotas={vehicle.cuotas}
        />
       
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {vehicle.warranty_type ? (
          <FeatureBadge
            icon={<ShieldCheck className="size-7 text-primary" />}
            label="Garantía"
            value={vehicle.warranty_type.name}
          />
        ) : null}
        <FeatureBadge
          icon={<ShieldAlert className="size-7 text-primary" />}
          label="Garantía por la marca"
          value={vehicle.by_brand_warranty ? "Sí" : "No"}
        />
        {dgt_label ? (
          <FeatureBadge
            icon={<Leaf className="size-7 text-primary" />}
            label="Distintivo DGT"
            value={dgt_label}
          />
        ) : null}
        {vehicle.color?.name ? (
          <FeatureBadge
            icon={<Palette className="size-7 text-primary" />}
            label="Color"
            value={vehicle.color.name}
          />
        ) : null}
      </div>
    </div>
  );
};

const FeatureBadge = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => {
  return (
    <div className="flex items-center gap-1 bg-muted-foreground/10 rounded-md px-3 py-1 w-fit">
      {icon}
      <div className="flex flex-col ">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold">{value}</span>
      </div>
    </div>
  );
};
