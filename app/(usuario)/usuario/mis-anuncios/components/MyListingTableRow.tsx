"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { IconType } from "react-icons";
import {
  FaComment,
  FaEye,
  FaHeart,
  FaPhone,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import { ChevronDown, Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  get_vehicle_status_label,
  type VehicleStatus,
} from "@/components/vehicles/constants/vehicle-status.constants";
import { VEHICLE_TRANSMISSION_TYPE_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import { cn, getImageUrl } from "@/lib/utils";
import { isNoVehicleImageFileKey } from "@/lib/vehicles/no-vehicle-image";
import type {
  OwnerVehicleListItem,
  OwnerVehicleStatTrend,
} from "@/interfaces/owner-vehicle.interface";
import { ListingHealthBadge } from "@/components/vehicles/listing-insights/components/ListingHealthBadge";
import { useEntitlements } from "@/hooks/useEntitlements";
import { RenewListingButton } from "./RenewListingButton";
import { FeatureListingButton } from "./FeatureListingButton";
import { MyListingActionsMenu } from "./MyListingActionsMenu";
import { formatThousands } from "@/components/ui/thousandsNumberInput";

interface MyListingTableRowProps {
  listing: OwnerVehicleListItem;
}

/**
 * Intl es-ES no agrupa números de 4 cifras ("9500"); usamos el mismo
 * formato que los inputs de precio y kilometraje ("9.500").
 */
const numberFormatter = {
  format: (value: number): string => formatThousands(String(Math.round(value))),
};

const formatPrice = (price: number): string =>
  `${numberFormatter.format(price)} €`;

const formatMileage = (mileage: number): string =>
  `${numberFormatter.format(mileage)} km`;

const statusBadgeClass: Record<VehicleStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  draft: "border-orange-200 bg-orange-50 text-orange-700",
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

const formatCount = (value: number, singular: string, plural: string) =>
  `${numberFormatter.format(value)} ${value === 1 ? singular : plural}`;

interface InlineStatProps {
  label: string;
  trend: OwnerVehicleStatTrend;
  icon: IconType;
  iconClassName: string;
}

/** Métrica en línea: icono + número. Los ceros se atenúan para que destaque lo que tiene actividad. */
const InlineStat = ({
  label,
  trend,
  icon: Icon,
  iconClassName,
}: InlineStatProps) => {
  const hasActivity = trend.current > 0;

  return (
    <div
      className="flex items-center gap-1.5 text-sm"
      title={label}
    >
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          hasActivity ? iconClassName : "text-muted-foreground/60",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "tabular-nums",
          hasActivity
            ? "font-semibold text-foreground"
            : "text-muted-foreground",
        )}
      >
        {numberFormatter.format(trend.current)}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

export const MyListingTableRow = ({ listing }: MyListingTableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();
  const { has } = useEntitlements();
  const showListingInsights = has("listing_insights");

  const primaryImageKey = listing.image?.url ?? "";
  const imageUrl = getImageUrl(primaryImageKey);
  const isPlaceholderImage = isNoVehicleImageFileKey(primaryImageKey);
  const publishedAgo = formatDistanceToNow(
    getPublishedReferenceDate(listing),
    { addSuffix: true, locale: es },
  );

  const specs = [
    formatMileage(listing.mileage),
    listing.fuel_type,
    getTransmissionLabel(listing.transmission_type),
  ].filter(Boolean);

  const { views, leads } = listing.stats;
  const vehicleHref = `/vehiculo/${listing.id}`;

  return (
    <div  className="gap-0 overflow-hidden py-0 data-[size=sm]:py-0 bg-white border border-card rounded-2xl ">
      <div className="flex items-center gap-3 p-2 sm:p-2.5">
        <Link
          href={vehicleHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group/image relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-16 sm:w-24"
          aria-label={`Ver anuncio ${listing.display_name}`}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            className={cn(
              "transition-transform duration-300 group-hover/image:scale-[1.04] motion-reduce:transition-none",
              isPlaceholderImage ? "object-contain" : "object-cover",
            )}
            sizes="96px"
          />
          {listing.is_featured_active ? (
            <span
              className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-full bg-blue-600 text-white"
              title="Destacado"
            >
              <FaStar className="size-2.5 text-amber-300" aria-hidden />
              <span className="sr-only">Destacado</span>
            </span>
          ) : null}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex min-w-0 items-baseline gap-2">
            <Link
              href={vehicleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-heading text-sm font-semibold leading-tight text-foreground transition-colors hover:text-primary sm:text-base"
            >
              {listing.display_name}
            </Link>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
              {publishedAgo}
            </span>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            <span className="text-sm font-bold text-foreground">
              {formatPrice(listing.price)}
            </span>
            <Badge
              variant="outline"
              className={cn("h-5 px-1.5 text-[11px]", statusBadgeClass[listing.status])}
            >
              {get_vehicle_status_label(listing.status)}
            </Badge>
            <span className="hidden truncate md:inline">
              {specs.join(" · ")}
            </span>
            <span className="tabular-nums">
              · {formatCount(views.current, "visita", "visitas")} ·{" "}
              {formatCount(leads.current, "contacto", "contactos")}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            className="hidden sm:inline-flex"
            aria-label={`Editar ${listing.display_name}`}
            render={<Link href={`/editar-vehiculo/${listing.id}`} />}
          >
            <Pencil className="text-amber-600" aria-hidden />
          </Button>
          <MyListingActionsMenu listing={listing} />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? "Ocultar detalles" : "Ver detalles"}
            onClick={() => setIsExpanded((value) => !value)}
          >
            <ChevronDown
              className={cn(
                "transition-transform duration-200 motion-reduce:transition-none",
                isExpanded && "rotate-180",
              )}
              aria-hidden
            />
          </Button>
        </div>
      </div>

      <div
        id={detailsId}
        inert={!isExpanded}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2.5 border-t px-2.5 py-2.5 sm:px-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <InlineStat label="Visitas" trend={views} icon={FaEye} iconClassName="text-sky-600" />
              <InlineStat label="Contactos" trend={leads} icon={FaComment} iconClassName="text-violet-600" />
              <InlineStat label="Teléfono" trend={listing.stats.phone_clicks} icon={FaPhone} iconClassName="text-blue-600" />
              <InlineStat label="WhatsApp" trend={listing.stats.whatsapp_clicks} icon={FaWhatsapp} iconClassName="text-green-600" />
              <InlineStat label="Favoritos" trend={listing.stats.favorites} icon={FaHeart} iconClassName="text-rose-500" />
            </div>

            {specs.length > 0 ? (
              <p className="text-xs text-muted-foreground md:hidden">
                {specs.join(" · ")} · {publishedAgo}
              </p>
            ) : null}

            {showListingInsights && listing.health ? (
              <ListingHealthBadge
                health={listing.health}
                listingName={listing.display_name}
                vehicleId={listing.id}
              />
            ) : null}

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
            {listing.scheduled_publish_at ? (
              <p className="text-xs font-medium text-primary">
                Programado para el{" "}
                {new Date(listing.scheduled_publish_at).toLocaleString("es-ES")}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={`/editar-vehiculo/${listing.id}`} />}
              >
                <Pencil data-icon="inline-start" className="text-amber-600" aria-hidden />
                Editar
              </Button>
              <RenewListingButton listing={listing} />
              <FeatureListingButton listing={listing} />
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={
                  <Link href={vehicleHref} target="_blank" rel="noopener noreferrer" />
                }
              >
                <Eye data-icon="inline-start" aria-hidden />
                Ver anuncio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
