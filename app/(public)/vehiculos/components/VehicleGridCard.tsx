"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useVehicleImpressionTracker } from "@/components/vehicles/hooks/useVehicleImpressionTracker";
import {
  getVehicleMakeName,
  getVehicleModelLine,
} from "@/lib/vehicles/getVehicleDisplayName";
import {
  formatPrice,
  formatMonthlyPrice,
  getConditionLabel,
  getImageUrl,
  getPrimaryCuotaValue,
  getVehicleDisplayName,
  getVehicleUrl,
} from "../utils";
import { buildVehicleGridSpecs } from "../utils/build-vehicle-grid-specs";
import { VehicleEngagementMenu } from "./VehicleEngagementMenu";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { VehicleShareDialog } from "./VehicleShareDialog";
import { useState } from "react";
import { VehicleShareButton } from "./VehicleShareButton";

interface VehicleGridCardProps {
  vehicle: VehicleListItem;
  interactive?: boolean;
  footer?: React.ReactNode;
  onDismissed?: (vehicleId: string) => void;
}

interface VehicleGridCardBadgesProps {
  vehicle: VehicleListItem;
}

interface VehicleGridCardBodyProps {
  vehicle: VehicleListItem;
  displayName: string;
  vehicleUrl: string;
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
  vehicleUrl,
  interactive,
}: VehicleGridCardBodyProps) => {
  const makeName = getVehicleMakeName(vehicle);
  const modelLine = getVehicleModelLine(vehicle);
  const specs = buildVehicleGridSpecs(vehicle);
  const cuotaValue = getPrimaryCuotaValue(vehicle);
  const financedLabel = cuotaValue ? formatMonthlyPrice(cuotaValue) : null;
  const detailLabel = `Ver detalle de ${displayName}`;

  return (
    <CardContent
      className={cn(
        "relative z-1 flex flex-col gap-2 px-2.5 pb-0",
        interactive && "pointer-events-none",
      )}
    >
      {makeName ? (
        <p className="text-[11px] font-bold tracking-wide text-primary uppercase">
          {makeName}
        </p>
      ) : null}

      <h3
        title={displayName}
        className="truncate text-base leading-snug font-bold text-slate-900"
      >
        {modelLine}
      </h3>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="text-lg font-bold tracking-tight text-slate-900">
          {formatPrice(vehicle.price)}
        </p>
        {financedLabel && (
          <p
            className="text-xs font-medium text-muted-foreground"
            title="Precio financiado estimado"
          >
            desde {financedLabel}
          </p>
        )}
      </div>

      {specs.length > 0 && (
        <ul
          className="grid grid-cols-2 gap-1.5"
          aria-label={`Características de ${displayName}`}
        >
          {specs.map(({ key, label, value, Icon }) => (
            <li
              key={key}
              className="flex min-w-0 items-center gap-1.5 text-xs text-slate-600"
              title={`${label}: ${value}`}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Icon className="size-3.5 text-primary" aria-hidden />
              </span>
              <span className="truncate font-medium">{value}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={vehicleUrl}
        prefetch={false}
        aria-label={detailLabel}
        title={detailLabel}
        tabIndex={0}
        className={cn(
          buttonVariants({ variant: "default", size: "sm" }),
          "pointer-events-auto relative z-10 mt-1 w-full justify-center gap-1.5",
        )}
      >
        Ver detalle
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </CardContent>
  );
};

export const VehicleGridCard = ({
  vehicle,
  interactive = false,
  footer,
  onDismissed,
}: VehicleGridCardProps) => {
  const imageUrl = getImageUrl(vehicle.images[0]?.url ?? "");
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);
  const impressionRef = useVehicleImpressionTracker<HTMLDivElement>(vehicle.id);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  return (
    <Card
      ref={impressionRef}
      className="group relative gap-2 overflow-hidden border-none bg-muted-foreground/10 pt-0 shadow-none ring-0 transition-shadow duration-200 hover:shadow-md pb-3"
    >
      {/* Enlace de ratón; el CTA "Ver detalle" es el único foco de teclado/lector. */}
      <Link
        href={vehicleUrl}
        prefetch={false}
        className="absolute inset-0 z-0 rounded-xl"
        aria-hidden
        tabIndex={-1}
      />

      <CardHeader className="pointer-events-none relative aspect-square overflow-hidden p-0 pt-0">
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

      <VehicleGridCardBody
        vehicle={vehicle}
        displayName={displayName}
        vehicleUrl={vehicleUrl}
        interactive={interactive}
      />
      {footer ? (
        <>
          <CardFooter className="relative z-10 pointer-events-auto px-2.5 pb-0">
            {footer}
          </CardFooter>
        </>
      ) : null}
    </Card>
  );
};
