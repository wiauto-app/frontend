import { vehicleService } from "@/services/vehicleService";
import { getVehicleDetail } from "./getVehicleDetail.server";
import { findVehicleReviews } from "./findVehicleReviews.server";


export const getVehicleData = async (id: string) => {
  const [old, data, reviews] = await Promise.all([
    getVehicleDetail(id),
    vehicleService.vehicles.findById(id),
    findVehicleReviews(id),
  ]);

  return {
    old,
    data,
    reviews,
  };
}