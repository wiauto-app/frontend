"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Car,
  Eye,
  Heart,
  MessageCircle,
  Pencil,
  Phone,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    nextStatus: VehicleStatus,
  ) => Promise<void>;
  isMutating?: boolean;
  canUseAdvancedEditor?: boolean;
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
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  inactive: "border-border bg-muted text-muted-foreground",
  sold: "border-blue-200 bg-blue-50 text-blue-700",
  archived: "border-border bg-muted text-muted-foreground",
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
  icon: Icon,
}: {
  label: string;
  trend: OwnerVehicleStatTrend;
  icon: LucideIcon;
}) => {
  const isPositive = (trend.change_percent ?? 0) >= 0;

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 bg-card px-2 py-1 text-center last:col-span-2 sm:last:col-span-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-4" aria-hidden />
        <span>{label}</span>
      </div>
      <span className="text-xl font-semibold tracking-tight text-foreground">
        {new Intl.NumberFormat("es-ES").format(trend.current)}
      </span>
      {/* <ListingPerformanceSparkline
        positive={isPositive}
        className="h-6 w-16"
        ariaLabel={`Tendencia de ${label}`}
      /> */}
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
  canUseAdvancedEditor = false,
  featurePriceLabel,
}: MyListingTableRowProps) => {
  const imageUrl = listing.image?.url ? getImageUrl(listing.image.url) : null;
  const transmissionLabel = getTransmissionLabel(listing.transmission_type);
  const publishedReference = getPublishedReferenceDate(listing);
  const publishedAgo = formatDistanceToNow(publishedReference, {
    addSuffix: true,
    locale: es,
  });
  const publishedDate = publishedReference.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const specs = [formatMileage(listing.mileage), transmissionLabel, listing.fuel_type]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card className="gap-0 overflow-hidden py-0 ">
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <Link
            href={`/vehiculo/${listing.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/image relative w-full h-52 xl:h-full rounded-xl overflow-hidden"
            aria-label={`Ver anuncio ${listing.display_name}`}
          >
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
                <Car className="size-10" aria-hidden />
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
            <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover/image:opacity-100" />
          </Link>

          <div className="flex min-w-0 flex-col gap-4 py-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-2">
                <Link
                  href={`/vehiculo/${listing.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xl font-semibold leading-tight text-foreground transition-colors hover:text-primary sm:text-2xl"
                >
                  {listing.display_name}
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={statusBadgeClass[listing.status]}
                  >
                    {get_vehicle_status_label(listing.status)}
                  </Badge>
                  {listing.is_featured_active ? (
                    <Badge variant="secondary">
                      <Star
                        data-icon="inline-start"
                        className="fill-current text-amber-500"
                        aria-hidden
                      />
                      Destacado
                    </Badge>
                  ) : null}
                </div>
              </div>

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

            <div className="flex flex-col gap-1.5">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {formatPrice(listing.price)}
              </p>
              {specs ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {specs}
                </p>
              ) : null}
              <p className="text-sm text-muted-foreground">
                Publicado el {publishedDate} · {publishedAgo}
              </p>
              {listing.scheduled_publish_at ? (
                <p className="text-sm font-medium text-primary">
                  Programado para el{" "}
                  {new Date(listing.scheduled_publish_at).toLocaleString("es-ES")}
                </p>
              ) : null}
            </div>

            {listing.is_featured_active && listing.featured_expires_at ? (
              <p className="text-xs font-medium text-amber-700">
                Destacado hasta{" "}
                {new Date(listing.featured_expires_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            ) : null}

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
              <Button
                nativeButton={false}
                render={
                  <Link
                    href={`/vehiculo/${listing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <Eye data-icon="inline-start" aria-hidden />
                Ver anuncio
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={`/editar-vehiculo/${listing.id}`} />}
              >
                <Pencil data-icon="inline-start" aria-hidden />
                Editar
              </Button>
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
            </div>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex-col items-stretch gap-4 px-4 py-4 sm:px-5">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Rendimiento
        </h3>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-3 lg:grid-cols-5">
          <PerformanceCell
            label="Visitas"
            trend={listing.stats.views}
            icon={Eye}
          />
          <PerformanceCell
            label="Contactos"
            trend={listing.stats.leads}
            icon={MessageCircle}
          />
          <PerformanceCell
            label="Teléfono"
            trend={listing.stats.phone_clicks}
            icon={Phone}
          />
          <PerformanceCell
            label="WhatsApp"
            trend={listing.stats.whatsapp_clicks}
            icon={MessageCircle}
          />
          <PerformanceCell
            label="Favoritos"
            trend={listing.stats.favorites}
            icon={Heart}
          />
        </div>
      </CardFooter>
    </Card>
  );
};
