"use client";

import Image from "next/image";
import { Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  get_vehicle_status_label,
  type VehicleStatus,
} from "@/components/vehicles/constants/vehicle-status.constants";
import { getImageUrl } from "@/lib/utils";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { MyListingStatsRow } from "./MyListingStatsRow";
import { RenewListingButton } from "./RenewListingButton";
import { MyListingActionsMenu } from "./MyListingActionsMenu";

interface MyListingCardProps {
  listing: OwnerVehicleListItem;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

const formatMileage = (mileage: number): string =>
  `${new Intl.NumberFormat("es-ES").format(mileage)} km`;

const statusBadgeClass: Record<VehicleStatus, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-700",
  sold: "bg-blue-100 text-blue-700",
  archived: "bg-slate-100 text-slate-700",
};

const getExpiryBadge = (listing: OwnerVehicleListItem): string | null => {
  if (listing.is_expired) {
    return "Expirado";
  }

  if (listing.days_until_expiry <= 14) {
    return `Expira en ${listing.days_until_expiry} días`;
  }

  return null;
};

export const MyListingCard = ({ listing }: MyListingCardProps) => {
  const imageUrl = listing.image?.url ? getImageUrl(listing.image.url) : null;
  const expiryBadge = getExpiryBadge(listing);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <a
          target="_blank"
          href={`/vehiculo/${listing.id}`}
          className="truncate font-semibold text-gray-900 hover:text-[#0061F2] hover:underline"
          rel="noreferrer"
        >
          {listing.display_name}
        </a>
        <div className="flex items-center gap-1">
          <p className="text-sm text-gray-500">{formatPrice(listing.price)}</p>
          <p className="text-sm text-gray-500">
            {formatMileage(listing.mileage)}
          </p>
          {listing.scheduled_publish_at ? (
            <p className="mt-1 text-xs text-blue-600">
              Programado:{" "}
              {new Date(listing.scheduled_publish_at).toLocaleString("es-ES")}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-4 transition-colors hover:bg-gray-50/50 xl:flex-row xl:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-200">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={listing.display_name}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Car className="h-6 w-6" aria-hidden />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          <MyListingStatsRow label="Visitas" trend={listing.stats.views} />
          <MyListingStatsRow label="Leads" trend={listing.stats.leads} />
          <MyListingStatsRow
            label="Favoritos"
            trend={listing.stats.favorites}
          />
          <MyListingStatsRow label="Compartidos" trend={listing.stats.shares} />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <Badge className={statusBadgeClass[listing.status]}>
              {get_vehicle_status_label(listing.status)}
            </Badge>
            {expiryBadge ? (
              <span className="text-[10px] font-medium text-amber-700">
                {expiryBadge}
              </span>
            ) : null}
          </div>

          <RenewListingButton listing={listing} />
          <MyListingActionsMenu listing={listing} />
        </div>
      </div>
    </div>
  );
};
