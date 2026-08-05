"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Car, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  get_vehicle_status_label,
  type VehicleStatus,
} from "@/components/vehicles/constants/vehicle-status.constants";
import { VEHICLE_TRANSMISSION_TYPE_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import { getImageUrl } from "@/lib/utils";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { OwnerVehicleStatTrend } from "@/interfaces/owner-vehicle.interface";
import { ListingPerformanceSparkline } from "./ListingPerformanceSparkline";
import { RenewListingButton } from "./RenewListingButton";
import { FeatureListingButton } from "./FeatureListingButton";
import { MyListingActionsMenu } from "./MyListingActionsMenu";

interface MyListingTableRowProps {
  listing: OwnerVehicleListItem;
  onRenew: (id: string) => Promise<void>;
  onFeature: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onSchedule: (listing: OwnerVehicleListItem) => void;
  onRemove: (id: string) => Promise<void>;
  onToggleStatus: (
    id: string,
    nextStatus: "active" | "inactive",
  ) => Promise<void>;
  isMutating?: boolean;
  isProfessional?: boolean;
  featurePriceLabel?: string | null;
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
  active: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  inactive: "bg-gray-100 text-gray-700 border-gray-200",
  sold: "bg-blue-100 text-blue-700 border-blue-200",
  archived: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusDotClass: Record<VehicleStatus, string> = {
  active: "bg-green-500",
  pending: "bg-amber-500",
  inactive: "bg-gray-400",
  sold: "bg-blue-500",
  archived: "bg-slate-400",
};

const getTransmissionLabel = (transmissionType?: string | null): string | null => {
  if (!transmissionType) {
    return null;
  }

  return (
    VEHICLE_TRANSMISSION_TYPE_OPTIONS.find((option) => option.value === transmissionType)
      ?.label ?? transmissionType
  );
};

const getPublishedReferenceDate = (listing: OwnerVehicleListItem): Date => {
  const renewedAt = listing.renewed_at ? new Date(listing.renewed_at) : null;
  const createdAt = new Date(listing.created_at);

  if (renewedAt && renewedAt > createdAt) {
    return renewedAt;
  }

  return createdAt;
};

const PerformanceCell = ({
  label,
  trend,
}: {
  label: string;
  trend: OwnerVehicleStatTrend;
}) => {
  const isPositive = (trend.change_percent ?? 0) >= 0;

  return (
    <div className="flex flex-col items-center gap-1 min-w-[72px]">
      <span className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{trend.current}</span>
      <ListingPerformanceSparkline
        positive={isPositive}
        className="w-12 h-6"
        ariaLabel={`Tendencia de ${label}`}
      />
    </div>
  );
};

export const MyListingTableRow = ({
  listing,
  onRenew,
  onFeature,
  onDuplicate,
  onSchedule,
  onRemove,
  onToggleStatus,
  isMutating = false,
  isProfessional = false,
  featurePriceLabel,
}: MyListingTableRowProps) => {
  const imageUrl = listing.image?.url ? getImageUrl(listing.image.url) : null;
  const transmissionLabel = getTransmissionLabel(listing.transmission_type);
  const publishedReference = getPublishedReferenceDate(listing);
  const publishedAgo = formatDistanceToNow(publishedReference, {
    addSuffix: true,
    locale: es,
  });

  const specs = [formatMileage(listing.mileage), transmissionLabel, listing.fuel_type]
    .filter(Boolean)
    .join(" · ");

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60 transition-colors">
      <td className="p-4 align-top">
        <div className="flex gap-3 min-w-0">
          <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden relative shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={listing.display_name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Car className="size-5" aria-hidden />
              </div>
            )}
          </div>

          <div className="min-w-0 space-y-1.5">
            <Link
              href={`/vehiculo/${listing.id}`}
              target="_blank"
              className="font-semibold text-gray-900 hover:text-blue-600 hover:underline line-clamp-2"
            >
              {listing.display_name}
            </Link>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className={statusBadgeClass[listing.status]}>
                {get_vehicle_status_label(listing.status)}
              </Badge>
              {listing.is_featured_active ? (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                  <Star className="mr-1 size-3 fill-amber-500 text-amber-500" aria-hidden />
                  Destacado
                </Badge>
              ) : null}
            </div>

            {specs ? <p className="text-xs text-gray-500">{specs}</p> : null}

            <p className="text-xs text-gray-400">
              Creado:{" "}
              {new Date(listing.created_at).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            {listing.is_featured_active && listing.featured_expires_at ? (
              <p className="text-xs text-amber-700">
                Destacado hasta{" "}
                {new Date(listing.featured_expires_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>
      </td>

      <td className="p-4 align-top hidden lg:table-cell">
        <div className="flex items-start justify-center gap-3">
          <PerformanceCell label="Visitas" trend={listing.stats.views} />
          <PerformanceCell label="Contactos" trend={listing.stats.leads} />
          <PerformanceCell label="Teléfono" trend={listing.stats.phone_clicks} />
          <PerformanceCell
            label="WhatsApp"
            trend={listing.stats.whatsapp_clicks}
          />
          <PerformanceCell label="Favoritos" trend={listing.stats.favorites} />
        </div>
      </td>

      <td className="p-4 align-top">
        <p className="font-semibold text-gray-900 whitespace-nowrap">
          {formatPrice(listing.price)}
        </p>
      </td>

      <td className="p-4 align-top">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full shrink-0 ${statusDotClass[listing.status]}`}
              aria-hidden
            />
            <span className="text-sm text-gray-700">
              {get_vehicle_status_label(listing.status)}
            </span>
          </div>
          <p className="text-xs text-gray-500">Publicado {publishedAgo}</p>
          {listing.scheduled_publish_at ? (
            <p className="text-xs text-blue-600">
              Programado:{" "}
              {new Date(listing.scheduled_publish_at).toLocaleString("es-ES")}
            </p>
          ) : null}
        </div>
      </td>

      <td className="p-4 align-top">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <RenewListingButton
            listing={listing}
            onRenew={onRenew}
            disabled={isMutating}
          />
          <FeatureListingButton
            listing={listing}
            onFeature={onFeature}
            disabled={isMutating}
            priceLabel={featurePriceLabel}
          />
          <MyListingActionsMenu
            listing={listing}
            onDuplicate={onDuplicate}
            onSchedule={onSchedule}
            onRemove={onRemove}
            onToggleStatus={onToggleStatus}
            isProfessional={isProfessional}
            disabled={isMutating}
          />
        </div>
      </td>
    </tr>
  );
};
