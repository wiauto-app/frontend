"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_GEO_RADIUS_METERS,
  GEO_LOCATION_KEYS,
  MAX_GEO_RADIUS_METERS,
  MIN_GEO_RADIUS_METERS,
  MUNICIPALITY_KEY,
  PROVINCE_KEY,
} from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useFiltersManager } from "@/hooks/useFiltersManager";

const GEO_RADIUS_DEBOUNCE_MS = 400;

const parseCoordinate = (value: string | string[] | undefined): number | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || raw === "") {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseRadiusMeters = (
  value: string | string[] | undefined,
): number | undefined => {
  const parsed = parseCoordinate(value);
  if (parsed === undefined || parsed <= 0) {
    return undefined;
  }
  return Math.round(parsed);
};

const clampRadiusMeters = (meters: number): number =>
  Math.min(
    MAX_GEO_RADIUS_METERS,
    Math.max(MIN_GEO_RADIUS_METERS, Math.round(meters)),
  );

const metersToKmLabel = (meters: number): string => {
  const km = meters / 1000;
  return Number.isInteger(km) ? `${km} km` : `${km.toFixed(1)} km`;
};

const GEOLOCATION_ERROR_PERMISSION_DENIED = 1;
const GEOLOCATION_ERROR_POSITION_UNAVAILABLE = 2;
const GEOLOCATION_ERROR_TIMEOUT = 3;

const getGeolocationErrorMessage = (code: number): string => {
  if (code === GEOLOCATION_ERROR_PERMISSION_DENIED) {
    return "Permiso de ubicación denegado. Actívalo en el navegador para buscar cerca de ti.";
  }
  if (code === GEOLOCATION_ERROR_POSITION_UNAVAILABLE) {
    return "No se pudo obtener tu ubicación. Inténtalo de nuevo.";
  }
  if (code === GEOLOCATION_ERROR_TIMEOUT) {
    return "La solicitud de ubicación tardó demasiado. Inténtalo de nuevo.";
  }
  return "No se pudo usar la ubicación del dispositivo.";
};

export const useGeolocationLocationFilter = () => {
  const { values, applyUrlUpdates } = useFiltersManager({
    keys: [
      GEO_LOCATION_KEYS.LAT,
      GEO_LOCATION_KEYS.LNG,
      GEO_LOCATION_KEYS.RADIUS,
    ],
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const lat = parseCoordinate(values[GEO_LOCATION_KEYS.LAT]);
  const lng = parseCoordinate(values[GEO_LOCATION_KEYS.LNG]);
  const radiusFromUrl =
    parseRadiusMeters(values[GEO_LOCATION_KEYS.RADIUS]) ??
    DEFAULT_GEO_RADIUS_METERS;

  const isActive =
    lat !== undefined &&
    lng !== undefined &&
    parseRadiusMeters(values[GEO_LOCATION_KEYS.RADIUS]) !== undefined;

  const [radiusSliderMeters, setRadiusSliderMeters] =
    useState(radiusFromUrl);
  const debouncedRadiusSliderMeters = useDebouncedValue(
    radiusSliderMeters,
    GEO_RADIUS_DEBOUNCE_MS,
  );

  useEffect(() => {
    setRadiusSliderMeters(radiusFromUrl);
  }, [radiusFromUrl]);

  const radiusQueryValue = values[GEO_LOCATION_KEYS.RADIUS];

  useEffect(() => {
    if (!isActive || lat === undefined || lng === undefined) {
      return;
    }

    const clamped_radius = clampRadiusMeters(debouncedRadiusSliderMeters);
    const url_radius = parseRadiusMeters(radiusQueryValue);

    if (url_radius === clamped_radius) {
      return;
    }

    applyUrlUpdates({
      [GEO_LOCATION_KEYS.RADIUS]: String(clamped_radius),
    });
  }, [
    applyUrlUpdates,
    debouncedRadiusSliderMeters,
    isActive,
    lat,
    lng,
    radiusQueryValue,
  ]);

  const radiusKmLabel = useMemo(
    () => metersToKmLabel(radiusSliderMeters),
    [radiusSliderMeters],
  );

  const clearCatalogLocationFromUrl = useCallback(() => {
    applyUrlUpdates({
      [PROVINCE_KEY]: undefined,
      [MUNICIPALITY_KEY]: undefined,
    });
  }, [applyUrlUpdates]);

  const clearGeoFromUrl = useCallback(() => {
    applyUrlUpdates({
      [GEO_LOCATION_KEYS.LAT]: undefined,
      [GEO_LOCATION_KEYS.LNG]: undefined,
      [GEO_LOCATION_KEYS.RADIUS]: undefined,
    });
  }, [applyUrlUpdates]);

  const enableCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no admite geolocalización.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15_000,
          maximumAge: 60_000,
        });
      });

      const next_radius = isActive
        ? clampRadiusMeters(radiusSliderMeters)
        : DEFAULT_GEO_RADIUS_METERS;

      applyUrlUpdates({
        [PROVINCE_KEY]: undefined,
        [MUNICIPALITY_KEY]: undefined,
        [GEO_LOCATION_KEYS.LAT]: String(position.coords.latitude),
        [GEO_LOCATION_KEYS.LNG]: String(position.coords.longitude),
        [GEO_LOCATION_KEYS.RADIUS]: String(next_radius),
      });
    } catch (error) {
      const geo_error = error as GeolocationPositionError;
      setLocationError(getGeolocationErrorMessage(geo_error.code));
    } finally {
      setIsLocating(false);
    }
  }, [applyUrlUpdates, isActive, radiusSliderMeters]);

  const disableCurrentLocation = useCallback(() => {
    setLocationError(null);
    clearGeoFromUrl();
  }, [clearGeoFromUrl]);

  const handleToggleCurrentLocation = useCallback(
    async (checked: boolean) => {
      if (checked) {
        await enableCurrentLocation();
        return;
      }
      disableCurrentLocation();
    },
    [disableCurrentLocation, enableCurrentLocation],
  );

  const handleRadiusSliderChange = useCallback((meters: number) => {
    if (!isActive) {
      return;
    }
    setRadiusSliderMeters(clampRadiusMeters(meters));
  }, [isActive]);

  return {
    isActive,
    isLocating,
    locationError,
    lat,
    lng,
    radiusMeters: radiusSliderMeters,
    radiusKmLabel,
    minRadiusMeters: MIN_GEO_RADIUS_METERS,
    maxRadiusMeters: MAX_GEO_RADIUS_METERS,
    enableCurrentLocation,
    disableCurrentLocation,
    handleToggleCurrentLocation,
    handleRadiusSliderChange,
    clearGeoFromUrl,
    clearCatalogLocationFromUrl,
  };
};
