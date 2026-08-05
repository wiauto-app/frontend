"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { VehicleImageCarousel } from "@/app/(public)/vehiculos/components/VehicleImageCarousel";
import { Button } from "@/components/ui/button";
import type { DismissedVehicleItem } from "@/interfaces/vehicle-engagement.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import {
  formatFavoritePublishedDate,
  getFavoriteVehicleBadge,
  getFavoriteVehicleHref,
  getFavoriteVehicleModelName,
  toCarouselImages,
} from "@/app/usuario/favoritos/utils/favorites.utils";
import type { VehicleListItemPreview } from "@/interfaces/vehicle-list.interface";

interface DismissedVehicleCardProps {
  item: DismissedVehicleItem;
  onRestore: (vehicleId: string) => Promise<void>;
  isRestoring?: boolean;
}

const buildFallbackPreview = (
  item: DismissedVehicleItem,
): VehicleListItemPreview => ({
  id: item.vehicle_id,
  version_summary: {
    make_name: "",
    model_name: "Vehículo",
    version_name: "",
    fuel_name: "",
  },
  price: 0,
  image_url: null,
  created_at: item.created_at,
  condition: "used",
  is_featured: false,
  category: null,
  publisher_id: "",
  publisher_name: "",
  previous_price: null,
  price_change: null,
});

export const DismissedVehicleCard = ({
  item,
  onRestore,
  isRestoring = false,
}: DismissedVehicleCardProps) => {
  const vehicle = item.vehicle ?? buildFallbackPreview(item);
  const vehicleHref = getFavoriteVehicleHref(item.vehicle_id);
  const displayName = item.vehicle
    ? getVehicleDisplayName(vehicle)
    : `Vehículo ${item.vehicle_id.slice(0, 8)}`;
  const publishedAt = vehicle.created_at || item.created_at;

  const handleRestore = async () => {
    await onRestore(item.vehicle_id);
  };

  return (
    <article className="flex flex-col gap-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 md:flex-row">
      <VehicleImageCarousel
        images={toCarouselImages(vehicle)}
        alt={displayName}
        href={vehicleHref}
      />

      <div className="flex flex-1 flex-col justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              {item.vehicle ? getFavoriteVehicleBadge(vehicle) : "Descartado"}
            </span>
            <span className="text-xs text-gray-500">
              Descartado el {formatFavoritePublishedDate(item.created_at)}
            </span>
          </div>

          <Link
            href={vehicleHref}
            className="mb-2 block text-2xl font-bold text-gray-900 hover:text-blue-600"
          >
            {item.vehicle ? getFavoriteVehicleModelName(vehicle) : displayName}
          </Link>

          {vehicle.publisher_name ? (
            <p className="text-sm text-gray-500">
              Publicado por{" "}
              <span className="font-medium text-gray-700">
                {vehicle.publisher_name}
              </span>
            </p>
          ) : null}

          {publishedAt ? (
            <p className="mt-1 text-xs text-gray-400">
              Anuncio del {formatFavoritePublishedDate(publishedAt)}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isRestoring}
            aria-label={`Restaurar ${displayName}`}
            onClick={() => {
              void handleRestore();
            }}
          >
            <RotateCcw className="size-4" aria-hidden />
            Restaurar
          </Button>
        </div>
      </div>
    </article>
  );
};
