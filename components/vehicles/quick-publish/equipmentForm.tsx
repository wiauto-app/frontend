"use client";

import { useQuery } from "@tanstack/react-query";
import { featuresService } from "../services/featuresService";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";
import { toggleCatalogIdInList } from "../utils/toggleCatalogIdInList";
import { Check, Plus } from "lucide-react";
import { GroupedFeaturesAccordion } from "../GroupedFeaturesAccordion";
import {
  FEATURES_CATALOG_LIMIT,
  formatSelectedCountLabel,
} from "../utils/groupFeaturesByCategory";
import type { Feature } from "../types/vehicles.types";

export const EquipmentForm = () => {
  const form = useFormContext<QuickVehicleSchema>();

  const { data: features, isPending } = useQuery({
    queryKey: ["features", { page: 1, limit: FEATURES_CATALOG_LIMIT }],
    queryFn: () =>
      featuresService.findAll({ page: 1, limit: FEATURES_CATALOG_LIMIT }),
  });

  return (
    <Controller
      name="features_ids"
      control={form.control}
      render={({ field, fieldState }) => {
        const ids = field.value ?? [];
        const catalogFeatures = features?.data ?? [];

        const handleToggleFeature = (featureId: string, isOn: boolean) => {
          field.onChange(toggleCatalogIdInList(ids, featureId, isOn));
        };

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Equipamiento
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Selecciona el equipamiento que incluye el vehículo
                </p>
              </div>

              {ids.length > 0 && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {formatSelectedCountLabel(ids.length)}
                </span>
              )}
            </div>

            <GroupedFeaturesAccordion
              features={catalogFeatures}
              selectedKeys={ids}
              getItemKey={(feature) => feature.id}
              accordionMode="all-open"
              isLoading={isPending}
              renderItems={(groupFeatures) => (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {groupFeatures.map((feature) => (
                    <EquipmentFeatureTile
                      key={feature.id}
                      feature={feature}
                      checked={ids.includes(feature.id)}
                      onToggle={handleToggleFeature}
                    />
                  ))}
                </div>
              )}
            />

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </div>
        );
      }}
    />
  );
};

interface EquipmentFeatureTileProps {
  feature: Feature;
  checked: boolean;
  onToggle: (featureId: string, isOn: boolean) => void;
}

const EquipmentFeatureTile = ({
  feature,
  checked,
  onToggle,
}: EquipmentFeatureTileProps) => {
  const checkboxId = `quick-feature-${feature.id}`;

  return (
    <label
      htmlFor={checkboxId}
      className={`
        group flex cursor-pointer items-center justify-between
        rounded-xl border px-4 py-3
        transition-all duration-150
        ${
          checked
            ? "border-primary bg-primary/5 shadow-sm"
            : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
        }
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex size-8 shrink-0 items-center justify-center
            rounded-lg text-xs font-semibold
            transition-colors
            ${
              checked
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }
          `}
        >
          {checked ? (
            <Check className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
        </div>

        <span
          className={`
            truncate text-sm font-medium
            ${checked ? "text-foreground" : "text-muted-foreground"}
          `}
        >
          {feature.name}
        </span>
      </div>

      <Checkbox
        hidden
        id={checkboxId}
        checked={checked}
        onCheckedChange={(value) => {
          onToggle(feature.id, value === true);
        }}
        className="ml-3 shrink-0"
      />
    </label>
  );
};
