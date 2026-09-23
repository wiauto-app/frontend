import { vehicleTypesService } from "@/components/vehicles/services/vehicleTypesService";
import type { VehicleType } from "@/interfaces/vehicle.interface";
import { CatalogResourceSelector } from "./catalogResourceSelector";

interface VehicleTypesSelectorProps {
  onValueChange: (value: string) => void;
  value?: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  triggerClassName?: string;
}

export const VehicleTypesSelector = ({
  onValueChange,
  value,
  ariaInvalid,
  disabled,
  placeholder = "Tipo de vehículo",
  triggerClassName,
}: VehicleTypesSelectorProps) => (
  <CatalogResourceSelector<VehicleType>
    queryKey={["vehicle-types"]}
    fetchItems={() => vehicleTypesService.findAll({ page: 1, limit: 100 })}
    value={value}
    onValueChange={onValueChange}
    placeholder={placeholder}
    ariaInvalid={ariaInvalid}
    disabled={disabled}
    triggerClassName={triggerClassName}
    getItemValue={(item) => item.id}
    getItemLabel={(item) => item.name}
  />
);
