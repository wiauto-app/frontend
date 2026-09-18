import Image from "next/image";

import { cn } from "@/lib/utils";
import { getApproximateMapPosition } from "@/lib/maps/approximate-map-position";
import {
  buildGoogleStaticMapUrl,
  type BuildGoogleStaticMapUrlOptions,
  type GoogleStaticMapMode,
} from "@/lib/maps/build-google-static-map-url";

export interface GoogleStaticMapProps
  extends Omit<BuildGoogleStaticMapUrlOptions, "lat" | "lng" | "mode"> {
  lat: number;
  lng: number;
  mode?: GoogleStaticMapMode;
  /**
   * Semilla para el offset aproximado (p. ej. id del vehículo).
   * Misma semilla → misma imagen → mejor cache y menos créditos.
   */
  approximateSeed?: string;
  /** Radio máximo del jitter cuando mode="approximate". @default 500 */
  approximateOffsetMeters?: number;
  className?: string;
  imgClassName?: string;
  alt?: string;
  /** Enlace opcional al mapa interactivo de Google. */
  openInGoogleMaps?: boolean;
  priority?: boolean;
}

export const GoogleStaticMap = ({
  lat,
  lng,
  mode = "exact",
  zoom,
  width = 640,
  height = 360,
  scale = 2,
  mapType,
  circleRadiusMeters,
  markerColor,
  language,
  region,
  approximateSeed,
  approximateOffsetMeters = 500,
  className,
  imgClassName,
  alt = "Mapa de ubicación",
  openInGoogleMaps = false,
  priority = false,
}: GoogleStaticMapProps) => {
  const mapPosition =
    mode === "approximate"
      ? getApproximateMapPosition(
          lat,
          lng,
          approximateOffsetMeters,
          approximateSeed ?? `${lat.toFixed(5)},${lng.toFixed(5)}`,
        )
      : { lat, lng };

  const resolvedZoom = zoom ?? (mode === "exact" ? 15 : 14);
  const src = buildGoogleStaticMapUrl({
    lat: mapPosition.lat,
    lng: mapPosition.lng,
    zoom: resolvedZoom,
    width,
    height,
    scale,
    mapType,
    mode,
    circleRadiusMeters,
    markerColor,
    language,
    region,
  });

  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-video items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        Mapa no disponible
      </div>
    );
  }

  const displayWidth = width * scale;
  const displayHeight = height * scale;

  const image = (
    <Image
      src={src}
      alt={alt}
      width={displayWidth}
      height={displayHeight}
      priority={priority}
      unoptimized
      className={cn("size-full object-cover", imgClassName)}
    />
  );

  if (!openInGoogleMaps) {
    return (
      <div className={cn("overflow-hidden rounded-lg bg-muted", className)}>
        {image}
      </div>
    );
  }

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${mapPosition.lat},${mapPosition.lng}`;

  return (
    <a
      href={mapsHref}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block overflow-hidden rounded-lg bg-muted outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={`${alt}. Abrir en Google Maps`}
    >
      {image}
    </a>
  );
};
