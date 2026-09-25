import { V1_VEHICLES } from "@/components/vehicles/services/route.constants";

export const vehicleInsightsPath = (vehicleId: string): string =>
  `${V1_VEHICLES}/${vehicleId}/insights`;
