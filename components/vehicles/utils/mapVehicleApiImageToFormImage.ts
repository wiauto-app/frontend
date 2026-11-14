import type { VehicleImage } from "@/interfaces/vehicle.interface";
import { getImageUrl } from "@/lib/utils";
import { normalize_compound_storage_path } from "@/services/files/filesService";

import type { VehicleFormImage } from "../schemas/vehicle.schema";

const is_public_http_url = (value: string): boolean =>
  /^https?:\/\//i.test(value.trim());

/** Imagen del detalle API → forma del formulario (path de almacén + preview si aplica). */
export const mapVehicleApiImageToFormImage = (
  image: VehicleImage,
  order: number,
): VehicleFormImage => {
  const raw_url = image.url?.trim() ?? "";
  const resolved_order = image.order ?? order;

  if (!raw_url) {
    return { id: image.id, order: resolved_order };
  }

  if (is_public_http_url(raw_url)) {
    const storage_path = normalize_compound_storage_path(raw_url);
    return {
      id: image.id,
      ...(storage_path ? { path: storage_path } : {}),
      preview_url: raw_url,
      order: resolved_order,
    };
  }

  const storage_path = normalize_compound_storage_path(raw_url);
  return {
    id: image.id,
    path: storage_path,
    preview_url: getImageUrl(storage_path),
    order: resolved_order,
  };
};