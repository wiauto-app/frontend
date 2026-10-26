"use client";

import Link from "next/link";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { useVehicleImpressionTracker } from "@/components/vehicles/hooks/useVehicleImpressionTracker";
import {
  formatPrice,
  getVehicleDisplayName,
  getVehicleModelName,
} from "../utils";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { VehicleFinancingFrom } from "./VehicleFinancingFrom";
import { VehicleImageCarousel } from "./VehicleImageCarousel";

type VehicleListCardProps = {
  vehicle: VehicleListItem;
};

export function VehicleListCard({ vehicle }: VehicleListCardProps) {
  const vehicleHref = `/vehiculo/${vehicle.id}`;
  const displayName = getVehicleDisplayName(vehicle);
  const impressionRef = useVehicleImpressionTracker<HTMLElement>(vehicle.id);

  return (
    <article
      ref={impressionRef}
      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
    >
      <div className="flex flex-col md:flex-row">
        <VehicleImageCarousel
          images={vehicle.images ?? []}
          alt={displayName}
          href={vehicleHref}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={vehicleHref}
                className="block text-xl font-bold text-slate-900 hover:text-[#0061F2]"
              >
                <h3>{getVehicleModelName(vehicle)}</h3>
              </Link>

              <VehicleFavoriteButton vehicleId={vehicle.id} />
            </div>

            <p className="text-2xl font-bold text-slate-900">
              {formatPrice(vehicle.price)}
            </p>
            <VehicleFinancingFrom
              offer={vehicle.financing_offer}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
