import type { VehicleListItemPreview } from "@/interfaces/vehicle-list.interface";
import { cn } from "@/lib/utils";
import { getFavoriteVehicleTagLabel } from "../utils/favorites.utils";

type FavoriteVehicleTagProps = {
  vehicle: VehicleListItemPreview;
  className?: string;
};

export const FavoriteVehicleTag = ({ vehicle, className }: FavoriteVehicleTagProps) => {
  const label = getFavoriteVehicleTagLabel(vehicle);

  return (
    <span
      className={cn(
        "rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        vehicle.is_featured
          ? "bg-amber-100 text-amber-700"
          : "bg-green-100 text-green-700",
        className,
      )}
    >
      {label}
    </span>
  );
};
