import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MEDIA_URL } from "@/constants/external.constant";
import {
  NO_VEHICLE_IMAGE_SRC,
  isNoVehicleImageFileKey,
} from "@/lib/vehicles/no-vehicle-image";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const OPTIONAL_FIELD_SUFFIX = "(opcional)";

export const formatFieldLabel = (label: string, optional = false): string =>
  optional ? `${label} ${OPTIONAL_FIELD_SUFFIX}` : label;

export const objectToQueryString = (obj?: object) => {
  if (!obj) return "";
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") {
          params.append(key, String(v));
        }
      });
    } else {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

/** Prefijo del CDN público (`NEXT_PUBLIC_MEDIA_URL`) + pathname `/{bucket}/{key}`. */
export const getImageUrl = (fileKey: string) => {
  if (isNoVehicleImageFileKey(fileKey)) {
    return NO_VEHICLE_IMAGE_SRC;
  }
  if (fileKey.startsWith("http://") || fileKey.startsWith("https://")) {
    return fileKey;
  }
  if (fileKey.startsWith("/")) {
    return `${MEDIA_URL ?? ""}${fileKey}`;
  }
  return `${MEDIA_URL ?? ""}/${fileKey}`;
};
