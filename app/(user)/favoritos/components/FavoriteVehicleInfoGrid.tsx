"use client";

import { useState } from "react";
import type { VehicleListItemPreview } from "@/interfaces/vehicle-list.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { formatPrice } from "@/app/(public)/vehiculos/utils";
import {
  formatFavoritePublishedDate,
  formatPriceChange,
} from "../utils/favorites.utils";
import { Button } from "@/components/ui/button";
import { VehiclePriceHistoryDialog } from "./VehiclePriceHistoryDialog";

type FavoriteVehicleInfoGridProps = {
  vehicle: VehicleListItemPreview;
  publishedAt: string;
};

export const FavoriteVehicleInfoGrid = ({
  vehicle,
  publishedAt,
}: FavoriteVehicleInfoGridProps) => {
  const [priceHistoryOpen, setPriceHistoryOpen] = useState(false);

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-4">
        <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
          <p className="mb-1 text-[10px] text-gray-500">Precio actual</p>
          <p className="text-sm font-semibold text-green-600 sm:text-base">
            {formatPrice(vehicle.price)}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setPriceHistoryOpen(true)}
          className="rounded-lg bg-gray-50 p-2 text-left hover:bg-gray-100 sm:p-3 h-auto"
          aria-label="Ver historia del precio"
        >
          <p className="mb-1 text-[10px] text-gray-500">Historia del precio</p>
          <p className="text-sm font-semibold text-gray-900 sm:text-base">
            {formatPriceChange(vehicle.price_change)}
          </p>
        </Button>

        <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
          <p className="mb-1 text-[10px] text-gray-500">Publicado</p>
          <p className="text-sm font-semibold text-gray-900 sm:text-base">
            {formatFavoritePublishedDate(publishedAt)}
          </p>
        </div>
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
