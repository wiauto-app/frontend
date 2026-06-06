import type { VehicleSharePlatform } from "@/interfaces/vehicle-list.interface";

type BuildVehicleShareUrlParams = {
  vehicleId: string;
  vehicleTitle?: string;
  origin?: string;
};

export const buildVehiclePublicUrl = ({
  vehicleId,
  origin,
}: BuildVehicleShareUrlParams): string => {
  const baseOrigin =
    origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${baseOrigin}/vehiculo/${vehicleId}`;
};

export const buildVehicleShareMessage = ({
  vehicleId,
  vehicleTitle,
  origin,
}: BuildVehicleShareUrlParams): string => {
  const url = buildVehiclePublicUrl({ vehicleId, origin });
  const title = vehicleTitle?.trim();

  if (!title) {
    return url;
  }

  return `${title} - ${url}`;
};

export const buildVehicleShareActionUrl = (
  platform: VehicleSharePlatform,
  params: BuildVehicleShareUrlParams,
): string | null => {
  const url = buildVehiclePublicUrl(params);
  const message = buildVehicleShareMessage(params);
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(message);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedMessage}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(params.vehicleTitle?.trim() ?? "")}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "copy_link":
      return url;
    default:
      return null;
  }
};

export const copyVehicleShareUrl = async (
  params: BuildVehicleShareUrlParams,
): Promise<boolean> => {
  const url = buildVehiclePublicUrl(params);

  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};

export const openVehicleShareWindow = (shareUrl: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.open(shareUrl, "_blank", "noopener,noreferrer");
};
