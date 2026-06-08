import Link from "next/link";
import type { VehicleDetailSpec } from "../types/vehicle-detail.types";
import { Feature } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailGeneralSpecsSectionProps = {
  features: Feature[];
};

export const VehicleDetailGeneralSpecsSection = ({
  features,
}: VehicleDetailGeneralSpecsSectionProps) => (
  <VehicleDetailCard title="Características generales">
    <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <li key={feature.id} className="flex justify-between py-2">
          <span className="text-muted-foreground text-sm">{feature.name}</span>
        </li>
      ))}
    </ol>

    <Link href="#" className="mt-4 inline-block text-sm text-blue-600">
      Ver ficha técnica completa →
    </Link>
  </VehicleDetailCard>
);
