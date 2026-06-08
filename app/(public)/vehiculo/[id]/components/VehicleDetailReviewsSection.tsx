import { Star } from "lucide-react";
import type { VehicleDetailReview } from "../types/vehicle-detail.types";
import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailReviewsSectionProps = {
  reviews: VehicleDetailReview[];
};

export const  VehicleDetailReviewsSection = ({
  reviews,
}: VehicleDetailReviewsSectionProps) => (
  <VehicleDetailCard title="Reseñas">
    {reviews.length === 0 ? (
      <p className="text-sm text-gray-600">
        Aún no hay reseñas para este vehículo.
      </p>
    ) : (
      reviews.map((review, index) => (
        <div key={review.id} className={index > 0 ? "pt-2" : ""}>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{review.author}</span>
            <div className="flex items-center gap-1">
              <Star
                className="size-4 fill-yellow-400 text-yellow-400"
                aria-hidden
              />
              <span className="text-sm text-gray-600">{review.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">{review.comment}</p>
        </div>
      ))
    )}


  </VehicleDetailCard>
);
