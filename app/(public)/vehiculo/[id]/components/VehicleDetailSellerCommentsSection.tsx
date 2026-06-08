import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailSellerCommentsSectionProps = {
  description: string;
};

export const VehicleDetailSellerCommentsSection = ({
  description,
}: VehicleDetailSellerCommentsSectionProps) => (
  <VehicleDetailCard title="Comentarios del anunciante">
    <p className="mb-4 leading-relaxed text-gray-600">{description}</p>
  </VehicleDetailCard>
);
