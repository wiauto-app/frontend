import { z } from "zod";

import type { VehicleReportMode } from "@/app/(landing)/colaboraciones/utils/resolveVehicleReportMode";
import { isSpanishLicensePlateFormat } from "@/lib/validations/licensePlate";

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

export interface CollabsVehicleReportQueryValues {
  query: string;
}

export const buildCollabsVehicleReportQuerySchema = (
  mode: VehicleReportMode,
) => {
  const base = z.object({
    query: z.string().trim().min(1, "Introduce un valor"),
  });

  if (mode === "plate") {
    return base.refine((data) => isSpanishLicensePlateFormat(data.query), {
      message: "Introduce una matrícula válida",
      path: ["query"],
    });
  }

  return base.refine(
    (data) => VIN_PATTERN.test(data.query.toUpperCase().replace(/\s+/g, "")),
    {
      message: "El VIN debe tener 17 caracteres",
      path: ["query"],
    },
  );
};

export const collabsVehicleReportQueryDefaultValues: CollabsVehicleReportQueryValues =
  {
    query: "",
  };
