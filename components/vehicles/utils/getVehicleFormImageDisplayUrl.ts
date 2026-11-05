import { getImageUrl } from "@/lib/utils";

import type { VehicleFormImage } from "../schemas/vehicle.schema";

interface VehicleFormImagePreviewFields {
  path?: string;
  preview_url?: string;
  order?: number;
}

export const getVehicleFormImageDisplayUrl = (
  image: Pick<VehicleFormImage, "path" | "preview_url">,
): string | undefined => {
  const preview = image.preview_url?.trim();
  if (preview) {
    return preview;
  }

  const path = image.path?.trim();
  if (path) {
    return getImageUrl(path);
  }

  return undefined;
};

export const getLeadVehicleFormImageUrl = (
  images: ReadonlyArray<VehicleFormImagePreviewFields> | undefined,
): string | undefined => {
  const sorted = [...(images ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  for (const image of sorted) {
    const url = getVehicleFormImageDisplayUrl(image);
    if (url) {
      return url;
    }
  }

  return undefined;
};
