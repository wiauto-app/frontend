"use client";

import Link from "next/link";
import { toast } from "sonner";
import { VehicleImageCarousel } from "@/app/(public)/vehiculos/components/VehicleImageCarousel";
import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import type { FavoritesPageItem } from "../hooks/useFavoritesPage";
import {
  getFavoriteVehicleBadge,
  getFavoriteVehicleHref,
  getFavoriteVehicleModelName,
  toCarouselImages,
} from "../utils/favorites.utils";
import { FavoriteVehicleActions } from "./FavoriteVehicleActions";
import { FavoriteVehicleInfoGrid } from "./FavoriteVehicleInfoGrid";
import { FavoriteVehicleTag } from "./FavoriteVehicleTag";

type FavoriteVehicleCardProps = {
  item: FavoritesPageItem;
  lists: VehicleList[];
  currentListId: string;
  onRemove: (vehicleId: string) => Promise<void>;
  onMove: (vehicleId: string, targetListId: string) => Promise<void>;
  onCopy: (vehicleId: string, targetListId: string) => Promise<void>;
  disabled?: boolean;
};

export const FavoriteVehicleCard = ({
  item,
  lists,
  currentListId,
  onRemove,
  onMove,
  onCopy,
  disabled = false,
}: FavoriteVehicleCardProps) => {
  const vehicle = item.vehicle;
  const vehicleHref = getFavoriteVehicleHref(vehicle.id);
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
    <article className="flex flex-col gap-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 md:flex-row">
      <VehicleImageCarousel
        images={toCarouselImages(vehicle)}
        alt={vehicle.title}
        href={vehicleHref}
      />

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              {getFavoriteVehicleBadge(vehicle)}
            </span>
            <FavoriteVehicleTag vehicle={vehicle} />
          </div>

          <Link
            href={vehicleHref}
            className="mb-4 block text-2xl font-bold text-gray-900 hover:text-blue-600"
          >
            {getFavoriteVehicleModelName(vehicle)}
          </Link>

          <FavoriteVehicleInfoGrid vehicle={vehicle} publishedAt={publishedAt} />

          {vehicle.publisher_name && (
            <p className="text-sm text-gray-500">
              Publicado por{" "}
              <span className="font-medium text-gray-700">{vehicle.publisher_name}</span>
            </p>
          )}
        </div>
      </div>

      <FavoriteVehicleActions
        lists={lists}
        currentListId={currentListId}
        vehicleId={item.vehicle_id}
        publisherId={publisherId}
        onRemove={handleRemove}
        onMove={handleMove}
        onCopy={handleCopy}
        disabled={disabled}
      />
    </article>
  );
};
