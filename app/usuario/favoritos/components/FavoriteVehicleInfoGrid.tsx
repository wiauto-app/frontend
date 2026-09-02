"use client";

import { useState, type ReactNode } from "react";
import type { VehicleListItemPreview } from "@/interfaces/vehicle-list.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { formatPrice } from "@/app/(public)/vehiculos/utils";
import {
  formatFavoritePublishedDate,
  formatPriceChange,
} from "../utils/favorites.utils";
import { VehiclePriceHistoryDialog } from "./VehiclePriceHistoryDialog";
import { EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteVehicleInfoGridProps {
  vehicle: VehicleListItemPreview;
  publishedAt: string;
}

interface FavoriteVehicleInfoCardProps {
  label: string;
  value: string;
  valueClassName?: string;
  actionLabel?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

const FavoriteVehicleInfoCard = ({
  label,
  value,
  valueClassName = "text-gray-900",
  actionLabel,
  icon,
  onClick,
}: FavoriteVehicleInfoCardProps) => {
  const content = (
    <div className="flex justify-between items-end">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span
          className={`text-sm font-semibold sm:text-base ${valueClassName}`}
        >
          {value}
        </span>
      </div>
      {icon && onClick ? <Button variant="outline" size="icon" onClick={onClick}>{icon}</Button> : null}
    </div>
  );

  return (
    <div className="flex flex-col rounded-lg bg-gray-50 p-2 sm:p-3">
      {content}
    </div>
  );
};

export const FavoriteVehicleInfoGrid = ({
  vehicle,
  publishedAt,
}: FavoriteVehicleInfoGridProps) => {
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);
  const handlePriceHistoryOpen = () => setPriceHistoryOpen(true);

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-4">
        <FavoriteVehicleInfoCard
          label="Precio actual"
          value={formatPrice(vehicle.price)}
          valueClassName="text-green-600"
        />
        <FavoriteVehicleInfoCard
          label="Historia del precio"
          value={formatPriceChange(vehicle.price_change)}
          actionLabel="Ver historia del precio"
          icon={<EyeIcon className="size-4" aria-hidden />}
          onClick={handlePriceHistoryOpen}
        />
        <FavoriteVehicleInfoCard
          label="Publicado"
          value={formatFavoritePublishedDate(publishedAt)}
        />
      </div>

      <VehiclePriceHistoryDialog
        open={priceHistoryOpen}
        onOpenChange={setPriceHistoryOpen}
        vehicleId={vehicle.id}
        vehicleTitle={getVehicleDisplayName(vehicle)}
      />
    </>
  );
};
