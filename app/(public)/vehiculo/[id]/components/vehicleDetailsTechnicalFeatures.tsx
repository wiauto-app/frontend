"use client";
import { Vehicle } from "@/interfaces/vehicle.interface";
import { buildVehicleDetailTechnicalSpecs } from "../utils/build-vehicle-technical-specs";
import { getTechnicalSpecIcon } from "../utils/technical-spec-icons";
import { TechnicalFeature } from "./technicalFeature";

export const VehicleDetailsTechnicalFeatures = ({
  vehicle,
}: {
  vehicle: Vehicle;
}) => {
  const specs = buildVehicleDetailTechnicalSpecs(vehicle);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
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