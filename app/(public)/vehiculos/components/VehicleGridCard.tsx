"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, Star } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVehicleImpressionTracker } from "@/components/vehicles/hooks/useVehicleImpressionTracker";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import {
  formatPrice,
  formatMonthlyPrice,
  getConditionLabel,
  getImageUrl,
  getPrimaryCuotaValue,
  getVehicleUrl,
} from "../utils";
import { buildVehicleGridSpecs } from "../utils/build-vehicle-grid-specs";
import { VehicleEngagementMenu } from "./VehicleEngagementMenu";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { VehicleShareButton } from "./VehicleShareButton";
import { Badge } from "@/components/ui/badge";

interface VehicleGridCardProps {
  vehicle: VehicleListItem;
  interactive?: boolean;
  footer?: React.ReactNode;
  onDismissed?: (vehicleId: string) => void;
  className?: string;
}

interface VehicleGridCardBadgesProps {
  vehicle: VehicleListItem;
}

interface VehicleGridCardBodyProps {
  vehicle: VehicleListItem;
  displayName: string;
  interactive: boolean;
}

const VEHICLE_GRID_IMAGE_SIZES = `
  (max-width: 640px) 100vw,
  (max-width: 1024px) 50vw,
  (max-width: 1536px) 33vw,
  25vw
`;

const VehicleGridCardBadges = ({ vehicle }: VehicleGridCardBadgesProps) => {
  const conditionLabel = getConditionLabel(vehicle.condition);
  const photoCount = vehicle.images?.length ?? 0;

  return (
    <>
      <div className="pointer-events-none absolute top-2 left-2 z-10 flex max-w-[70%] flex-wrap gap-1.5">
        <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-700 uppercase shadow-sm backdrop-blur-sm">
          {conditionLabel}
        </span>
        {vehicle.dgt_label?.code && (
          <span
            className="rounded-md bg-emerald-600/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase shadow-sm"
            title={`Distintivo DGT ${vehicle.dgt_label.name || vehicle.dgt_label.code}`}
          >
            DGT {vehicle.dgt_label.code}
          </span>
        )}
      </div>

      {photoCount > 1 && (
        <span
          className="pointer-events-none absolute bottom-2 left-2 z-10 inline-flex items-center gap-1 rounded-md bg-slate-900/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
          aria-label={`${photoCount} fotos`}
        >
          <Camera className="size-3" aria-hidden />
          {photoCount}
        </span>
      )}
    </>
  );
};

const VehicleGridCardBody = ({
  vehicle,
  displayName,
  interactive,
}: VehicleGridCardBodyProps) => {
  const specs = buildVehicleGridSpecs(vehicle);
  const cuotaValue = getPrimaryCuotaValue(vehicle);
  const financedLabel = cuotaValue ? formatMonthlyPrice(cuotaValue) : null;
  const dealership = vehicle?.dealership;
  const dealershipRating = dealership?.rating
    ? parseFloat(dealership.rating).toFixed(1)
    : null;
  return (
    <CardContent
      className={cn(
        "relative z-1 flex flex-col gap-4 px-2.5 pb-0",
        interactive && "pointer-events-none",
      )}
    >
      <h3
        title={displayName}
        className="truncate text-base leading-snug font-bold text-slate-900"
      >
        {displayName}
      </h3>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <div className="flex items-start gap-2">
          <div className="flex flex-col ">
            <span className="text-xs font-semibold text-muted-foreground ">
              Buen precio
            </span>
            <p className="text-2xl font-bold tracking-tight text-red-600">
              {formatPrice(vehicle.price)}
            </p>
          </div>
          {vehicle.finance_price && (
            <div className="flex flex-col ">
              <span className="text-xs font-semibold text-muted-foreground ">
                Financiado: {formatPrice(vehicle.finance_price)}
              </span>
              <p className="text-2xl font-bold flex items-center gap-1 tracking-tight">
                {financedLabel}{" "}
                <span className="text-xs text-muted-foreground">/mes</span>
              </p>
            </div>
          )}
        </div>
      </div>
      {vehicle.warranty_type && (
        <div className="flex items-center gap-1 ">
          <p className="text-xs font-medium text-green-600">IVA incluido</p>
          <span className="text-muted-foreground text-xs">•</span>
          <p className="text-xs font-medium ">
            Garantía {vehicle.warranty_type?.name}
          </p>
        </div>
      )}
      {specs.length > 0 && (
        <ul
          className="flex flex-wrap gap-x-3 gap-y-1"
          aria-label={`Características de ${displayName}`}
        >
          {specs.map(({ key, label, value, Icon }) => (
            <li
              key={key}
              className="
          flex min-w-0 items-center gap-1 text-xs text-muted-foreground
          after:ml-0.5
          after:text-muted-foreground
          after:content-['•']
          last:after:hidden
        "
              title={`${label}: ${value}`}
            >
              <Icon className="size-3.5 text-primary" aria-hidden />
              <span className="truncate font-medium">{value}</span>
            </li>
          ))}
        </ul>
      )}
      {dealership && (
        <div className="flex items-center gap-1">
          <Badge>
            Profesional
            {dealershipRating && (
              <>
                {dealershipRating}
                <Star
                  aria-label="Puntuación de la concesionaria"
                  //llenar con color
                  fill="currentColor"
                  className="size-3.5 text-yellow-500"
                  aria-hidden
                />
              </>
            )}
          </Badge>
        </div>
      )}
    </CardContent>
  );
};

export const VehicleGridCard = ({
  vehicle,
  interactive = false,
  footer,
  onDismissed,
  className,
}: VehicleGridCardProps) => {
  const imageUrl = getImageUrl(vehicle.images[0]?.url ?? "");
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);
  const impressionRef = useVehicleImpressionTracker<HTMLDivElement>(vehicle.id);
  return (
    <Card
      ref={impressionRef}
      className={cn(
        "group relative gap-2 overflow-hidden border-none bg-muted-foreground/10 pt-0 shadow-none ring-0 transition-shadow duration-200 hover:shadow-md pb-3 rounded-2xl h-full",
        className,
      )}
    >
      {/* Enlace de ratón; el CTA "Ver detalle" es el único foco de teclado/lector. */}
      <Link
        href={vehicleUrl}
        prefetch={false}
        className="absolute inset-0 z-0 rounded-xl"
        aria-hidden
        tabIndex={-1}
      />

      <CardHeader className="pointer-events-none relative aspect-video overflow-hidden p-0 pt-0">
        <div className="pointer-events-auto absolute top-2 right-2 z-10 flex items-center gap-1">
          <VehicleFavoriteButton
            vehicleId={vehicle.id}
            className="rounded-full bg-white shadow-sm"
          />
          <VehicleShareButton
            vehicleId={vehicle.id}
            vehicleTitle={displayName}
          />
          <VehicleEngagementMenu
            vehicleId={vehicle.id}
            className="rounded-full bg-white shadow-sm"
            onDismissed={onDismissed}
          />
        </div>

        <VehicleGridCardBadges vehicle={vehicle} />

        <Image
          src={imageUrl}
          alt={`Imagen del vehículo ${displayName}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          quality={80}
          sizes={VEHICLE_GRID_IMAGE_SIZES}
          aria-hidden
        />
      </CardHeader>
      <Link href={vehicleUrl}>
        <VehicleGridCardBody
          vehicle={vehicle}
          displayName={displayName}
          interactive={interactive}
        />
        {footer ? (
          <>
            <CardFooter className="relative z-10 pointer-events-auto px-2.5 pb-0">
              {footer}
            </CardFooter>
          </>
        ) : null}
      </Link>
    </Card>
  );
};
