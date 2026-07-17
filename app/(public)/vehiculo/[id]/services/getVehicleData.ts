import { vehicleService } from "@/services/vehicleService";
import { findVehicleReviews } from "./findVehicleReviews.server";


export const getVehicleData = async (id: string) => {
  const [data, reviews] = await Promise.all([
    vehicleService.vehicles.findById(id),
    findVehicleReviews(id),
  ]);

  return {
    data,
    reviews,
  };
}