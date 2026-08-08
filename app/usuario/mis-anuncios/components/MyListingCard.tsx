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
  onRenew: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onSchedule: (listing: OwnerVehicleListItem) => void;
  onRemove: (id: string) => Promise<void>;
  onToggleStatus: (
    id: string,
    nextStatus: "active" | "inactive",
  ) => Promise<void>;
  isMutating?: boolean;
  canUseAdvancedEditor?: boolean;
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

export const MyListingCard = ({
  listing,
  onRenew,
  onDuplicate,
  onSchedule,
  onRemove,
  onToggleStatus,
  isMutating = false,
  canUseAdvancedEditor = false,
}: MyListingCardProps) => {
  const imageUrl = listing.image?.url ? getImageUrl(listing.image.url) : null;
  const expiryBadge = getExpiryBadge(listing);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="min-w-0 flex items-center gap-4 justify-between">
        <a target="_blank" href={`/vehiculo/${listing.id}`} className="font-semibold text-gray-900 truncate hover:text-[#0061F2] hover:underline">
          {listing.display_name}
        </a>
       <div className="flex items-center gap-1">
       <p className="text-sm text-gray-500">{formatPrice(listing.price)}</p>
        <p className="text-sm text-gray-500">
          {formatMileage(listing.mileage)}
        </p>
        {listing.scheduled_publish_at ? (
          <p className="text-xs text-blue-600 mt-1">
            Programado:{" "}
            {new Date(listing.scheduled_publish_at).toLocaleString("es-ES")}
          </p>
        ) : null}
       </div>
      </div>
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden relative shrink-0">
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
                <Car className="w-6 h-6" aria-hidden />
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

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end gap-1">
            <Badge className={statusBadgeClass[listing.status]}>
              {get_vehicle_status_label(listing.status)}
            </Badge>
            {expiryBadge ? (
              <span className="text-[10px] text-amber-700 font-medium">
                {expiryBadge}
              </span>
            ) : null}
          </div>

          <RenewListingButton
            listing={listing}
            onRenew={onRenew}
            disabled={isMutating}
          />

          <MyListingActionsMenu
            listing={listing}
            onDuplicate={onDuplicate}
            onSchedule={onSchedule}
            onRemove={onRemove}
            onToggleStatus={onToggleStatus}
            canUseAdvancedEditor={canUseAdvancedEditor}
            disabled={isMutating}
          />
        </div>
      </div>
    </div>
  );
};
