import { apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type {
  CreateReviewDto,
  FindReviewsParams,
  PaginatedReviewsResponse,
  Review,
} from "@/interfaces/review.interface";

export const reviewService = {
  findAll: (
    params: FindReviewsParams,
  ): Promise<ApiResponse<PaginatedReviewsResponse>> =>
    apiGet<PaginatedReviewsResponse>("/v1/reviews", {
      vehicle_id: params.vehicle_id,
      page: params.page,
      limit: params.limit,
      order_by: params.order_by,
      order_direction: params.order_direction,
    }),

  create: (data: CreateReviewDto): Promise<ApiResponse<Review>> =>
    apiPost<Review>("/v1/reviews", data),
};
