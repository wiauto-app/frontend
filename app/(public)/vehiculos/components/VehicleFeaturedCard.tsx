"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useVehicleImpressionTracker } from "@/components/vehicles/hooks/useVehicleImpressionTracker";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { cn } from "@/lib/utils";

import {
  formatMonthlyPrice,
  formatPrice,
  getImageUrl,
  getPrimaryCuotaValue,
  getVehicleUrl,
} from "../utils";
import { buildVehicleGridSpecs } from "../utils/build-vehicle-grid-specs";
import { VehicleFavoriteButton } from "./VehicleFavoriteButton";
import { Button } from "@/components/ui/button";

interface VehicleFeaturedCardProps {
  vehicle: VehicleListItem;
  className?: string;
}

const FEATURED_IMAGE_SIZES = `
  (max-width: 640px) 100vw,
  (max-width: 1024px) 50vw,
  (max-width: 1536px) 33vw,
  25vw
`;

export const VehicleFeaturedCard = ({
  vehicle,
  className,
}: VehicleFeaturedCardProps) => {
  const displayName = getVehicleDisplayName(vehicle);
  const vehicleUrl = getVehicleUrl(vehicle.id);
  const imageUrl = getImageUrl(vehicle.images?.[0]?.url ?? "");
  const photoCount = vehicle.images?.length ?? 0;
  const specs = buildVehicleGridSpecs(vehicle);
  const dgtCode = vehicle.dgt_label?.code;
  const warrantyTypeName = vehicle.warranty_type?.name;
  const financePriceAmount = vehicle.finance_price;
  const cuotaValue = getPrimaryCuotaValue(vehicle);
  const financedMonthlyLabel = cuotaValue
    ? formatMonthlyPrice(cuotaValue)
    : null;
  const isProfessional =
    vehicle.publisher_type === "dealership" || Boolean(vehicle.dealership);
  const impressionRef = useVehicleImpressionTracker<HTMLDivElement>(vehicle.id);

  return (
    <Card
      ref={impressionRef}
      className={cn(
        "col-span-2 group relative h-full  gap-0 overflow-hidden rounded-[20px] border-none bg-[#061936] p-0 shadow-none ring-0",
        className,
      )}
    >
      {/* <Link
        href={vehicleUrl}
        prefetch={false}
        className="absolute inset-0 z-0 rounded-[20px]"
        aria-label={`Ver ${displayName}`}
      /> */}

      <div className="absolute inset-0 z-0 overflow-hidden bg-slate-200">
        <Image
          src={imageUrl}
          alt={`Imagen del vehículo ${displayName}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          quality={80}
          sizes={FEATURED_IMAGE_SIZES}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-[#061936] via-[#061936]/80 to-transparent"
        />
      </div>

      {dgtCode ? (
        <div className="pointer-events-none absolute top-2.5 left-2.5 z-20">
          <span className="rounded-md bg-emerald-600/95 px-2 py-1 text-[10px] font-extrabold tracking-wide text-white uppercase">
            DGT {dgtCode}
          </span>
        </div>
      ) : null}

      {photoCount > 1 ? (
        <span
          className="pointer-events-none absolute bottom-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 rounded-md bg-slate-900/60 px-2 py-1 text-[11px] font-bold text-white"
          aria-label={`${photoCount} fotos`}
        >
          <Camera className="size-3.5" aria-hidden />
          {photoCount}
        </span>
      ) : null}

      <div className="relative z-10 flex h-full flex-col gap-2.5 px-4 pt-2 pb-4">
        <div className="flex items-center justify-between gap-2">
          <h3
            title={displayName}
            className="max-w-[min(100%,15.5rem)] truncate text-lg font-extrabold text-white"
          >
            {displayName}
          </h3>
          <div className="pointer-events-auto relative z-20 shrink-0">
            <VehicleFavoriteButton
              vehicleId={vehicle.id}
              className="size-9 rounded-full bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-4 gap-y-1">
          <p className="text-[28px] leading-8 font-black text-white">
            {formatPrice(vehicle.price)}
          </p>
          {financePriceAmount ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-white">
                Financiado: {formatPrice(financePriceAmount)}
              </p>
              {financedMonthlyLabel ? (
                <p className="truncate text-lg font-extrabold text-white">
                  {financedMonthlyLabel}
                  <span className="ml-1 text-xs font-semibold text-white/80">
                    /mes
                  </span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {warrantyTypeName ? (
          <div className="flex max-w-48 items-center gap-1.5">
            <span className="text-[11px] font-bold text-green-600">
              IVA incluido
            </span>
            <span className="text-[11px] text-slate-400" aria-hidden>
              •
            </span>
            <span className="truncate text-[11px] font-semibold text-white">
              Garantía {warrantyTypeName}
            </span>
          </div>
        ) : null}

        {specs.length > 0 ? (
          <ul
            className="flex max-w-[65%] flex-wrap gap-x-2.5 gap-y-1"
            aria-label={`Características de ${displayName}`}
          >
            {specs.map(({ key, label, value, Icon }) => (
              <li
                key={key}
                className="flex min-w-0 items-center gap-1"
                title={`${label}: ${value}`}
              >
                <Icon className="size-3.5 shrink-0 text-white" aria-hidden />
                <span className="truncate text-[11px] font-semibold text-white">
                  {value}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex min-w-0 items-center gap-1">
            {isProfessional ? (
              <span className="text-xs font-bold text-white">
                ◈ Profesional
              </span>
            ) : (
              <span className="text-xs font-bold text-white">Particular</span>
            )}
            {warrantyTypeName ? (
              <span className="truncate text-xs font-bold text-[#2E88FF]">
                Garantía {warrantyTypeName}
              </span>
            ) : null}
          </div>
          <Link href={vehicleUrl}>
            <Button variant="outline" size="sm" className="text-primary rounded-full">
              Ver anuncio <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
