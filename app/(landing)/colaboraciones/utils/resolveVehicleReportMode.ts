import type { StrapiLink } from "@/interfaces/strapi-components.interface";

export type VehicleReportMode = "plate" | "vin";

export const resolveVehicleReportMode = (
  button?: StrapiLink | null,
): VehicleReportMode => {
  if (!button) {
    return "plate";
  }

  const urlHint = button.url?.trim().toLowerCase() ?? "";
  if (urlHint === "vin") {
    return "vin";
  }
  if (urlHint === "matricula") {
    return "plate";
  }

  if (/vin/i.test(button.label)) {
    return "vin";
  }

  return "plate";
};
