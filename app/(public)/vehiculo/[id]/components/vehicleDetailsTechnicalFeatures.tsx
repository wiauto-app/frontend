"use client"; 
import { Vehicle } from "@/interfaces/vehicle.interface";
import { buildVehicleTechnicalSpecs } from "../utils/build-vehicle-technical-specs";
import { getTechnicalSpecIcon } from "../utils/technical-spec-icons";
import { TechnicalFeature } from "./technicalFeature";

export const VehicleDetailsTechnicalFeatures = ({
  vehicle,
  limit,
  labels,
}: {
  vehicle: Vehicle;
  limit?: number;
  labels?: string[];
}) => {
  const allSpecs = buildVehicleTechnicalSpecs(vehicle);
  const specs = labels
    ? labels
        .map((label) => allSpecs.find((spec) => spec.label === label))
        .filter((spec): spec is NonNullable<typeof spec> => spec !== undefined)
        .slice(0, limit)
    : allSpecs.slice(0, limit);

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
