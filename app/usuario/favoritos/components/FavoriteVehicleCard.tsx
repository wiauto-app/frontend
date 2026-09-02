"use client";

import Link from "next/link";
import { toast } from "sonner";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import type { FavoritesPageItem } from "../hooks/useFavoritesPage";
import { getFavoriteVehicleHref } from "../utils/favorites.utils";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { FavoriteVehicleActions } from "./FavoriteVehicleActions";
import { FavoriteVehicleInfoGrid } from "./FavoriteVehicleInfoGrid";
import { WiautoImage } from "@/components/ui/wiautoImage";
import { Card, CardContent } from "@/components/ui/card";

interface FavoriteVehicleCardProps {
  item: FavoritesPageItem;
  lists: VehicleList[];
  currentListId: string;
  itemCounts: Record<string, number>;
  onRemove: (vehicleId: string) => Promise<void>;
  onMove: (vehicleId: string, targetListId: string) => Promise<void>;
  onCopy: (vehicleId: string, targetListId: string) => Promise<void>;
  disabled?: boolean;
}

export const FavoriteVehicleCard = ({
  item,
  lists,
  currentListId,
  itemCounts,
  onRemove,
  onMove,
  onCopy,
  disabled = false,
}: FavoriteVehicleCardProps) => {
  const vehicle = item.vehicle;
  const vehicleHref = getFavoriteVehicleHref(vehicle.id);
  const displayName = getVehicleDisplayName(vehicle);
  const publishedAt = vehicle.created_at ?? item.created_at;
  const publisherId = vehicle.publisher_id ?? "";

  const handleRemove = async () => {
    try {
      await onRemove(item.vehicle_id);
      toast.success("Vehículo quitado de la lista");
    } catch {
      toast.error("No se pudo quitar el vehículo");
    }
  };

  const handleMove = async (targetListId: string) => {
    try {
      await onMove(item.vehicle_id, targetListId);
      toast.success("Vehículo movido correctamente");
    } catch {
      toast.error("No se pudo mover el vehículo");
    }
  };

  const handleCopy = async (targetListId: string) => {
    try {
      await onCopy(item.vehicle_id, targetListId);
      toast.success("Vehículo copiado correctamente");
    } catch {
      toast.error("No se pudo copiar el vehículo");
    }
  };

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
        <Link
          href={vehicleHref}
          className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:w-56 lg:w-72"
          aria-label={`Ver anuncio de ${displayName}`}
        >
          <WiautoImage
            src={vehicle.image_url ?? ""}
            alt={displayName}
            className="object-cover transition-transform hover:scale-[1.02]"
            fill
            sizes="(max-width: 640px) 100vw, 288px"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <Link
                href={vehicleHref}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 sm:text-2xl"
              >
                {displayName}
              </Link>

              <FavoriteVehicleActions
                lists={lists}
                currentListId={currentListId}
                itemCounts={itemCounts}
                vehicleId={item.vehicle_id}
                publisherId={publisherId}
                onRemove={handleRemove}
                onMove={handleMove}
                onCopy={handleCopy}
                disabled={disabled}
              />
            </div>

            <FavoriteVehicleInfoGrid
              vehicle={vehicle}
              publishedAt={publishedAt}
            />

            {vehicle.publisher_name && (
              <p className="text-sm text-gray-500">
                Publicado por{" "}
                <span className="font-medium text-gray-700">
                  {vehicle.publisher_name}
                </span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
