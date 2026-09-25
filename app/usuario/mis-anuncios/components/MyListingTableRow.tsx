"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { IconType } from "react-icons";
import {
  FaCar,
  FaComment,
  FaEye,
  FaHeart,
  FaPhone,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  get_vehicle_status_label,
  type VehicleStatus,
} from "@/components/vehicles/constants/vehicle-status.constants";
import { VEHICLE_TRANSMISSION_TYPE_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import { cn, getImageUrl } from "@/lib/utils";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import type { OwnerVehicleStatTrend } from "@/interfaces/owner-vehicle.interface";
import { RenewListingButton } from "./RenewListingButton";
import { FeatureListingButton } from "./FeatureListingButton";
import { MyListingActionsMenu } from "./MyListingActionsMenu";
import { Eye, Pencil } from "lucide-react";
import { ListingHealthBadge } from "@/components/vehicles/listing-insights/components/ListingHealthBadge";
import { useEntitlements } from "@/hooks/useEntitlements";

interface MyListingTableRowProps {
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
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  inactive: "border-border bg-muted text-muted-foreground",
  sold: "border-blue-200 bg-blue-50 text-blue-700",
  archived: "border-border bg-muted text-muted-foreground",
};

const getTransmissionLabel = (
  transmissionType?: string | null,
): string | null => {
  if (!transmissionType) {
    return null;
  }

  return (
    VEHICLE_TRANSMISSION_TYPE_OPTIONS.find(
      (option) => option.value === transmissionType,
    )?.label ?? transmissionType
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

interface PerformanceCellProps {
  label: string;
  trend: OwnerVehicleStatTrend;
  icon: IconType;
  iconClassName: string;
  className?: string;
}

/**
 * En móvil: rejilla 3 + 2 (cuadros). Desde `sm` se muestra la etiqueta;
 * en `2xl` las cinco métricas van en una sola fila.
 */
const PerformanceCell = ({
  label,
  trend,
  icon: Icon,
  iconClassName,
  className,
}: PerformanceCellProps) => {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 bg-card px-2 py-3 text-center sm:gap-1 sm:px-2 sm:py-2.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon
          className={`size-3.5 shrink-0 sm:size-4 ${iconClassName}`}
          aria-hidden
        />
        <span className="truncate">{label}</span>
      </div>
      <span className="text-base font-semibold tracking-tight text-foreground sm:text-xl">
        {new Intl.NumberFormat("es-ES").format(trend.current)}
      </span>
    </div>
  );
};

export const MyListingTableRow = ({ listing }: MyListingTableRowProps) => {
  const { has } = useEntitlements();
  const showListingInsights = has("listing_insights");
  const imageUrl = listing.image?.url ? getImageUrl(listing.image.url) : null;
  const publishedReference = getPublishedReferenceDate(listing);
  const publishedAgo = formatDistanceToNow(publishedReference, {
    addSuffix: true,
    locale: es,
  });

  return (
    <Card size="sm" className="gap-0 overflow-hidden  ">
      <CardContent className="">
        <div className="grid grid-cols-1 gap-3 sm:gap-5 xl:grid-cols-3">
          <Link
            href={`/vehiculo/${listing.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/image relative h-36 lg:h-full w-full overflow-hidden rounded-xl "
            aria-label={`Ver anuncio ${listing.display_name}`}
          >
            <div className="flex flex-wrap items-center gap-2 absolute top-2 left-2 z-10">
              <Badge
                variant="outline"
                className={statusBadgeClass[listing.status]}
              >
                {get_vehicle_status_label(listing.status)}
              </Badge>
              {listing.is_featured_active ? (
                <Badge variant="secondary">
                  <FaStar
                    data-icon="inline-start"
                    className="text-amber-500"
                    aria-hidden
                  />
                  Destacado
                </Badge>
              ) : null}
            </div>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={listing.display_name}
                fill
                className="object-cover transition-transform duration-500 group-hover/image:scale-[1.025]"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <FaCar className="size-10" aria-hidden />
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
            <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover/image:opacity-100" />
          </Link>

          <div className="flex min-w-0 flex-col gap-2 lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/vehiculo/${listing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-heading text-base font-semibold leading-tight text-foreground transition-colors hover:text-primary "
                  >
                    {listing.display_name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    · {publishedAgo}
                  </span>
                </div>

                {showListingInsights && listing.health ? (
                  <ListingHealthBadge
                    health={listing.health}
                    listingName={listing.display_name}
                    vehicleId={listing.id}
                  />
                ) : null}
              </div>

              <MyListingActionsMenu listing={listing} />
            </div>

            <div className="flex flex-col gap-1 sm:gap-1.5">
              <p className="text-xl font-bold tracking-tight text-foreground ">
                {formatPrice(listing.price)}
              </p>
              {/* 
              <p className="text-xs text-muted-foreground ">
                <span className="sm:hidden">Publicado {publishedAgo}</span>
                <span className="hidden sm:inline">
                  Publicado el {publishedDate}
                </span>
              </p> */}
            </div>

            {listing.is_featured_active && listing.featured_expires_at ? (
              <p className="text-xs font-medium text-amber-700">
                Destacado hasta{" "}
                {new Date(listing.featured_expires_at).toLocaleDateString(
                  "es-ES",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  },
                )}
              </p>
            ) : null}
            {listing.scheduled_publish_at ? (
              <p className="text-sm font-medium text-primary">
                Programado para el{" "}
                {new Date(listing.scheduled_publish_at).toLocaleString("es-ES")}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-1.5">
              <FeatureListingButton listing={listing} />
              <RenewListingButton listing={listing} />
              <Link
                href={`/vehiculo/${listing.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <Eye data-icon="inline-start" aria-hidden />
                  Ver anuncio
                </Button>
              </Link>

              <Button
                variant="outline"
                nativeButton={false}
                className="h-8 text-xs sm:h-9 sm:text-sm"
                render={<Link href={`/editar-vehiculo/${listing.id}`} />}
              >
                <Pencil
                  data-icon="inline-start"
                  className="text-amber-600"
                  aria-hidden
                />
                Editar
              </Button>
            </div>
            <div className="grid grid-cols-6 gap-px overflow-hidden rounded-lg border bg-border 2xl:grid-cols-5">
              <PerformanceCell
                label="Visitas"
                trend={listing.stats.views}
                icon={FaEye}
                iconClassName="text-sky-600"
                className="col-span-2 2xl:col-span-1"
              />
              <PerformanceCell
                label="Contactos"
                trend={listing.stats.leads}
                icon={FaComment}
                iconClassName="text-violet-600"
                className="col-span-2 2xl:col-span-1"
              />
              <PerformanceCell
                label="Teléfono"
                trend={listing.stats.phone_clicks}
                icon={FaPhone}
                iconClassName="text-blue-600"
                className="col-span-2 2xl:col-span-1"
              />
              <PerformanceCell
                label="WhatsApp"
                trend={listing.stats.whatsapp_clicks}
                icon={FaWhatsapp}
                iconClassName="text-green-600"
                className="col-span-3 2xl:col-span-1"
              />
              <PerformanceCell
                label="Favoritos"
                trend={listing.stats.favorites}
                icon={FaHeart}
                iconClassName="text-rose-500"
                className="col-span-3 2xl:col-span-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
