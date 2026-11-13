export const NO_VEHICLE_IMAGE_SRC = "/no_vehicle_images.png";

export const isNoVehicleImageFileKey = (
  fileKey: string | null | undefined,
): boolean => !fileKey || fileKey === NO_VEHICLE_IMAGE_SRC;
