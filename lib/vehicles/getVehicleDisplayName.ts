import type { VehicleVersionSummary } from "@/interfaces/vehicle.interface";

type VehicleWithVersion = {
  version: {
    name: string;
    make: { name: string };
    model: { name: string };
  };
};

type VehicleWithVersionSummary = {
  version_summary: VehicleVersionSummary;
};

export type VehicleDisplayNameInput =
  | VehicleVersionSummary
  | VehicleWithVersionSummary
  | VehicleWithVersion;

const resolveVersionParts = (
  source: VehicleDisplayNameInput,
): VehicleVersionSummary => {
  if ("version" in source && source.version) {
    return {
      make_name: source.version.make?.name ?? "",
      model_name: source.version.model?.name ?? "",
      version_name: source.version.name ?? "",
    };
  }

  if ("version_summary" in source && source.version_summary) {
    return source.version_summary;
  }

  return source as VehicleVersionSummary;
};

export const getVehicleDisplayName = (source: VehicleDisplayNameInput): string => {
  const { make_name, model_name, version_name } = resolveVersionParts(source);
  return [make_name, model_name, version_name].filter(Boolean).join(" ") || "Vehículo";
};

export const getVehicleMakeName = (source: VehicleDisplayNameInput): string =>
  resolveVersionParts(source).make_name;

export const getVehicleModelLine = (source: VehicleDisplayNameInput): string => {
  const { model_name, version_name } = resolveVersionParts(source);
  const modelLine = [model_name, version_name].filter(Boolean).join(" ");
  return modelLine || getVehicleDisplayName(source);
};

export type { VehicleVersionSummary };
