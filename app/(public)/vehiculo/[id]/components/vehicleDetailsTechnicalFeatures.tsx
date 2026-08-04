"use client"; 
import { Vehicle } from "@/interfaces/vehicle.interface";
import { buildVehicleTechnicalSpecs } from "../utils/build-vehicle-technical-specs";
import { getTechnicalSpecIcon } from "../utils/technical-spec-icons";
import { TechnicalFeature } from "./technicalFeature";

export const VehicleDetailsTechnicalFeatures = ({
  vehicle,
}: {
  vehicle: Vehicle;
}) => {
  const specs = buildVehicleTechnicalSpecs(vehicle);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {specs.map((spec) => {
        const Icon = getTechnicalSpecIcon(spec.label);

        return (
          <TechnicalFeature
            key={spec.label}
            Icon={Icon}
            label={spec.label}
            value={spec.value}
          />
        );
      })}
    </div>
  );
};
