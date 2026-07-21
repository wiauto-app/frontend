"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  getVehicleMakeName,
  getVehicleModelLine,
} from "@/lib/vehicles/getVehicleDisplayName";
import {
  formatPrice,
  formatMonthlyPrice,
  getConditionLabel,
  getImageUrl,
  getVehicleDisplayName,
  getVehicleUrl,
} from "../utils";
import {
  buildVehicleGridSpecs,
  getPublisherTypeLabel,
} from "../utils/build-vehicle-grid-specs";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";

interface VehicleGridCardProps {
  vehicle: VehicleListItem;
  interactive?: boolean;
}

interface VehicleGridCardBadgesProps {
  vehicle: VehicleListItem;
}

interface VehicleGridCardBodyProps {
  vehicle: VehicleListItem;
  displayName: string;
  interactive: boolean;
}

const VehicleGridCardBadges = ({ vehicle }: VehicleGridCardBadgesProps) => {
  const conditionLabel = getConditionLabel(vehicle.condition);
  const photoCount = vehicle.images?.length ?? 0;

  return (
    <>
      <div className="pointer-events-none absolute top-2 left-2 z-10 flex max-w-[70%] flex-wrap gap-1.5">
        {vehicle.is_featured && (
          <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary-foreground uppercase shadow-sm">
            Destacado
          </span>
        )}
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
  const makeName = getVehicleMakeName(vehicle);
  const modelLine = getVehicleModelLine(vehicle);
  const specs = buildVehicleGridSpecs(vehicle);
  const publisherLabel = getPublisherTypeLabel(vehicle.publisher_type);
  const financedLabel = vehicle.cuota?.value
    ? formatMonthlyPrice(vehicle.cuota.value)
    : null;


  return (
    <CardContent
      className={cn(
        "relative z-1 flex flex-col gap-2 px-2.5 pb-3",
        interactive && "pointer-events-none",
      )}
    >
      {makeName ? (
        <p className="text-[11px] font-bold tracking-wide text-primary uppercase">
          {makeName}
        </p>
      ) : null}

      {interactive ? (
        <h3
          title={displayName}
          className="truncate text-base leading-snug font-bold text-slate-900"
        >
          {modelLine}
        </h3>
      ) : (
        <Link
          href={getVehicleUrl(vehicle.id)}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1"
          aria-label={`Ver detalle de ${displayName}`}
        >
          <h3
            title={displayName}
            className="truncate text-base leading-snug font-bold text-slate-900 transition-colors hover:text-primary"
          >
            {modelLine}
          </h3>
        </Link>
      )}

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

      {(publisherLabel || vehicle.warranty_type?.name) && (
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-slate-200/80 pt-2 text-[11px] text-muted-foreground">
          {publisherLabel && <span>{publisherLabel}</span>}
          {publisherLabel && vehicle.warranty_type?.name && (
            <span aria-hidden>·</span>
          )}
          {vehicle.warranty_type?.name && (
            <span
              className="truncate"
              title={`Garantía ${vehicle.warranty_type.name}`}
            >
              Garantía {vehicle.warranty_type.name}
            </span>
          )}
        </div>
      )}
    </CardContent>
  );
};

export const VehicleGridCard = ({
  vehicle,
  interactive = false,
}: VehicleGridCardProps) => {
  const imageUrl = getImageUrl(vehicle.images[0]?.url ?? "");
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);

    const sizes = `
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              (max-width: 1536px) 25vw,
              350px
    `
  return (
    <Card
      className={cn(
        "relative gap-2 overflow-hidden border-none bg-muted-foreground/10 pt-0 shadow-none ring-0 transition-shadow duration-200 hover:shadow-md",
        interactive && "group",
      )}
    >
      {interactive && (
        <Link
          href={vehicleUrl}
          prefetch={false}
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={`Ver detalle de ${displayName}`}
        />
      )}

      <CardHeader className="relative aspect-square overflow-hidden p-0 pt-0">
        <div
          className={cn(
            "absolute top-2 right-2 z-10",
            interactive && "pointer-events-auto",
          )}
        >
          <VehicleFavoriteButton
            vehicleId={vehicle.id}
            className="rounded-full bg-white shadow-sm"
          />
        </div>

        <VehicleGridCardBadges vehicle={vehicle} />

        {!interactive ? (
          <Link
            href={vehicleUrl}
            className="absolute inset-0 z-0"
            aria-label={`Ver detalle de ${displayName}`}
          >
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              className="object-cover transition-transform duration-300 hover:scale-[1.03]"
              quality={80}
              sizes={sizes}
            />
          </Link>
        ) : (
          <Image
            src={imageUrl}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            quality={80}
            sizes={sizes}
          />
        )}
      </CardHeader>

      <VehicleGridCardBody
        vehicle={vehicle}
        displayName={displayName}
        interactive={interactive}
      />
    </Card>
  );
};
