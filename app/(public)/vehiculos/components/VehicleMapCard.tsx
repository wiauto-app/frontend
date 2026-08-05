"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getVehicleMakeName,
  getVehicleModelLine,
} from "@/lib/vehicles/getVehicleDisplayName";
import {
  formatMonthlyPrice,
  formatPrice,
  getConditionLabel,
  getPrimaryCuotaValue,
  getVehicleDisplayName,
  getVehicleUrl,
} from "../utils";
import { buildVehicleGridSpecs } from "../utils/build-vehicle-grid-specs";
import { useSelectedVehicleStore } from "../stores/selectedVehicleStore";
import { VehicleImageCarousel } from "./VehicleImageCarousel";

export const VehicleMapCard = () => {
  const selectedVehicle = useSelectedVehicleStore(
    (state) => state.selectedVehicle,
  );
  const clearSelectedVehicle = useSelectedVehicleStore(
    (state) => state.clearSelectedVehicle,
  );

  if (!selectedVehicle) {
    return null;
  }

  const displayName = getVehicleDisplayName(selectedVehicle);
  const makeName = getVehicleMakeName(selectedVehicle);
  const modelLine = getVehicleModelLine(selectedVehicle);
  const vehicleUrl = getVehicleUrl(selectedVehicle.id);
  const conditionLabel = getConditionLabel(selectedVehicle.condition);
  const specs = buildVehicleGridSpecs(selectedVehicle).slice(0, 2);
  const cuotaValue = getPrimaryCuotaValue(selectedVehicle);
  const financedLabel = cuotaValue ? formatMonthlyPrice(cuotaValue) : null;
  const detailLabel = `Ver detalle de ${displayName}`;

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    clearSelectedVehicle();
  };

  return (
    <article
      className="absolute bottom-4 left-4 z-20 w-[min(100%-2rem,320px)] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200/80"
      onClick={handleCardClick}
      aria-label={`Vista previa de ${displayName}`}
    >
      <div className="relative">
        <VehicleImageCarousel
          images={selectedVehicle.images ?? []}
          alt={displayName}
          href={vehicleUrl}
          className="w-full md:w-full lg:w-full [&_a]:aspect-[16/10] [&_a]:md:aspect-[16/10] [&_a]:md:h-auto [&_a]:md:min-h-0"
        />

        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 size-8 rounded-full bg-white/95 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white"
          aria-label="Cerrar"
        >
          <X className="size-4" aria-hidden />
        </Button>

        <div className="pointer-events-none absolute top-2 left-2 z-10 flex max-w-[70%] flex-wrap gap-1.5">
          <span className="rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-700 uppercase shadow-sm backdrop-blur-sm">
            {conditionLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3">
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
            {formatPrice(selectedVehicle.price)}
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
            "mt-1 w-full justify-center gap-1.5",
          )}
        >
          Ver detalle
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
};
