import type { VehicleVideo } from "@/interfaces/vehicle.interface";
import type { VehicleFormVideo } from "../schemas/vehicle.schema";

/**
 * Vídeos existentes del detalle → `{id, order}` (+ campos de UI). Se mapean
 * TODOS, también los que se procesan o fallaron: el update es estado final y
 * omitirlos los borraría.
 */
export const mapVehicleVideosToFormValues = (
  videos: VehicleVideo[] | undefined,
): VehicleFormVideo[] =>
  [...(videos ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((video, order) => ({
      id: video.id,
      order,
      ...(video.url ? { preview_url: video.url } : {}),
      ...(video.thumbnail_url ? { thumbnail_url: video.thumbnail_url } : {}),
      ...(typeof video.duration_s === "number"
        ? { duration_s: video.duration_s }
        : {}),
      ...(video.status ? { status: video.status } : {}),
    }));
