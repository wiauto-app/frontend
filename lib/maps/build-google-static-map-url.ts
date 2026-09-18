import { GOOGLE_MAPS_API_KEY } from "@/constants";
import { buildCirclePathCoordinates } from "./approximate-map-position";

export type GoogleStaticMapMode = "exact" | "approximate";
export type GoogleStaticMapType =
  | "roadmap"
  | "satellite"
  | "terrain"
  | "hybrid";

export interface BuildGoogleStaticMapUrlOptions {
  lat: number;
  lng: number;
  zoom?: number;
  width?: number;
  height?: number;
  /** 2 = retina; Google factura como size base. */
  scale?: 1 | 2;
  mapType?: GoogleStaticMapType;
  mode?: GoogleStaticMapMode;
  /** Radio del círculo en modo approximate. @default 350 */
  circleRadiusMeters?: number;
  markerColor?: string;
  language?: string;
  region?: string;
}

const DEFAULT_MARKER_COLOR = "0x0153E8";
const MAX_STATIC_SIZE = 640;

export const buildGoogleStaticMapUrl = (
  options: BuildGoogleStaticMapUrlOptions,
): string | null => {
  if (!GOOGLE_MAPS_API_KEY) {
    return null;
  }

  const {
    lat,
    lng,
    zoom = 14,
    width = 640,
    height = 360,
    scale = 2,
    mapType = "roadmap",
    mode = "exact",
    circleRadiusMeters = 350,
    markerColor = DEFAULT_MARKER_COLOR,
    language = "es",
    region = "ES",
  } = options;

  const sizeWidth = Math.min(Math.max(1, Math.round(width)), MAX_STATIC_SIZE);
  const sizeHeight = Math.min(Math.max(1, Math.round(height)), MAX_STATIC_SIZE);
  const center = `${lat.toFixed(6)},${lng.toFixed(6)}`;

  const params = new URLSearchParams({
    center,
    zoom: String(zoom),
    size: `${sizeWidth}x${sizeHeight}`,
    scale: String(scale),
    maptype: mapType,
    language,
    region,
    key: GOOGLE_MAPS_API_KEY,
  });

  if (mode === "exact") {
    params.append("markers", `color:${markerColor}|${center}`);
  } else {
    const path = buildCirclePathCoordinates(lat, lng, circleRadiusMeters);
    params.append(
      "path",
      `color:0x0153E8CC|fillcolor:0x0153E826|weight:2|${path}`,
    );
  }

  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};
