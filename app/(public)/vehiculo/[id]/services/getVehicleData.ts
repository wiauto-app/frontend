import { vehicleService } from "@/services/vehicleService";

export const getVehicleData = async (id: string) => {
  const data = await vehicleService.vehicles.findById(id);
  return { data };
};
