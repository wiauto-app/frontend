import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailSellerCommentsSectionProps = {
  description: string;
};

export const VehicleDetailDescription = ({
  description,
}: VehicleDetailSellerCommentsSectionProps) => (
  <VehicleDetailCard title="Descripción del vehículo">
    <p className="mb-4 leading-relaxed text-gray-600">{description}</p>
  </VehicleDetailCard>
);
