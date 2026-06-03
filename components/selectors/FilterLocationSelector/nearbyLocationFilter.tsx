"use client";

import { Loader2, MapPin } from "lucide-react";

import { CustomCheckbox } from "@/components/ui/customCheckbox";
import { Separator } from "@/components/ui/separator";

import type { useGeolocationLocationFilter } from "./hooks/useGeolocationLocationFilter";

type NearbyLocationFilterProps = ReturnType<typeof useGeolocationLocationFilter>;

export const NearbyLocationFilter = ({
  isActive,
  isLocating,
  locationError,
  radiusMeters,
  radiusKmLabel,
  minRadiusMeters,
  maxRadiusMeters,
  handleToggleCurrentLocation,
  handleRadiusSliderChange,
}: NearbyLocationFilterProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-md bg-muted p-2">
      <CustomCheckbox
        checked={isActive}
        disabled={isLocating}
        onChange={(event) => handleToggleCurrentLocation(event.target.checked)}
        label={
          <span className="flex items-center gap-2">
            {isLocating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <MapPin className="size-4 shrink-0" aria-hidden />
            )}
            Cerca de mi ubicación
          </span>
        }
      />

      {locationError && (
        <p className="text-xs text-destructive" role="alert">
          {locationError}
        </p>
      )}

      {isActive && (
        <div className="flex flex-col gap-2 px-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Radio de búsqueda</span>
            <span className="font-medium tabular-nums">{radiusKmLabel}</span>
          </div>

          <input
            type="range"
            min={minRadiusMeters}
            max={maxRadiusMeters}
            step={5_000}
            value={radiusMeters}
            onChange={(event) =>
              handleRadiusSliderChange(Number(event.target.value))
            }
            aria-label="Radio de búsqueda en kilómetros"
            aria-valuetext={radiusKmLabel}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/20 accent-primary"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minRadiusMeters / 1000} km</span>
            <span>{maxRadiusMeters / 1000} km</span>
          </div>
        </div>
      )}

      <Separator />
    </div>
  );
};
