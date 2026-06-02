import {
  Color,
  Cuota,
  DgtLabel,
  Feature,
  FuelType,
  Service,
  Traction,
  VehicleType,
  WarrantyType,
} from "./vehicle.interface";

export interface FiltersResponse {
  vehicleTypes: VehicleType[];
  services: Service[];
  cuotas: Cuota[];
  tractions: Traction[];
  warranties: WarrantyType[];
  colors: Color[];
  dgtLabels: DgtLabel[];
  features: Feature[];
  fuels: FuelType[];
}
