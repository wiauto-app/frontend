import { VehicleType } from "@/interfaces/vehicle.interface";
import { createCatalogCrudService } from "./catalogCrudService";
import { V1_VEHICLE_TYPES } from "./route.constants";

/** El backend serializa la entidad bajo la clave `vehicleType`. */
export const vehicleTypesService =
  createCatalogCrudService<VehicleType>(
    V1_VEHICLE_TYPES,
    "vehicleType",
  );
