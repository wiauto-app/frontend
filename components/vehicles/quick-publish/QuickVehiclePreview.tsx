"use client";

import { useQuery } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { getImageUrl } from "@/lib/utils";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { catalogVersionsService } from "@/components/vehicles/services/catalogVersionsService";
import { makesService } from "@/components/vehicles/services/makesService";
import { modelService } from "@/components/vehicles/services/modelService";
import { yearsService } from "@/components/vehicles/services/yearsService";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const QuickVehiclePreview = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const watched = useWatch({ control: form.control });

  const images = watched.images ?? [];
  const mainImage = images[0];
  const versionId = watched.version_id;

  const { data: version } = useQuery({
    queryKey: ["catalogVersion", versionId],
    queryFn: () => catalogVersionsService.findOne(versionId!),
    enabled: Boolean(versionId && versionId > 0),
  });

  const { data: make } = useQuery({
    queryKey: ["make", version?.make_id],
    queryFn: () => makesService.findOne(version!.make_id),
    enabled: Boolean(version?.make_id),
  });

  const { data: model } = useQuery({
    queryKey: ["model", version?.model_id],
    queryFn: () => modelService.findOne(version!.model_id),
    enabled: Boolean(version?.model_id),
  });

  const { data: year } = useQuery({
    queryKey: ["year", version?.year_id],
    queryFn: () => yearsService.findOne(version!.year_id),
    enabled: Boolean(version?.year_id),
  });

  const title =
    [make?.name, model?.name, version?.name].filter(Boolean).join(" ") ||
    "Tu vehículo";

  const conditionLabel =
    VEHICLE_CONDITION_OPTIONS.find((item) => item.value === watched.condition)
      ?.label ?? "";

  const subtitle = [
    year?.year,
    watched.mileage != null ? `${watched.mileage.toLocaleString("es-ES")} km` : null,
    conditionLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-sm">Vista previa de tu anuncio</h3>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="relative aspect-video bg-muted">
          {mainImage?.path ? (
            <img
              src={getImageUrl(mainImage.path)}
              alt="Vista previa del vehículo"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Sin fotos
            </div>
          )}
          {images.length > 0 ? (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
              {images.length} fotos
            </span>
          ) : null}
        </div>
        <div className="space-y-1 p-4">
          <p className="font-semibold leading-tight">{title}</p>
          {subtitle ? (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
          <p className="text-xl font-bold text-primary">
            {watched.price != null && watched.price > 0
              ? priceFormatter.format(watched.price)
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};
