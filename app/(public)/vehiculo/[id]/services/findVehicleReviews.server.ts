import { API_URL } from "@/constants";
import type { PaginatedReviewsResponse, Review } from "@/interfaces/review.interface";
import type { VehicleDetailReview } from "../types/vehicle-detail.types";

const mapReviewToVehicleDetailReview = (
  review: Review,
): VehicleDetailReview => ({
  id: review.id,
  author: review.author,
  rating: review.rating,
  comment: review.comment,
});

export const findVehicleReviews = async (
  vehicle_id: string,
): Promise<VehicleDetailReview[]> => {
  if (!API_URL) {
    return [];
  }

  const params = new URLSearchParams({
    vehicle_id,
    page: "1",
    limit: "20",
    order_by: "created_at",
    order_direction: "DESC",
  });

  try {
    const response = await fetch(`${API_URL}/v1/reviews?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const body = (await response.json()) as {
      data?: PaginatedReviewsResponse;
    };

    const reviews = body.data?.data ?? [];

    return reviews.map(mapReviewToVehicleDetailReview);
  } catch {
    return [];
  }
};
