import type { PaginatedResponse } from "./vehicle.interface";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  author: string;
}

export interface FindReviewsParams {
  vehicle_id: string;
  page?: number;
  limit?: number;
  order_by?: "created_at" | "rating";
  order_direction?: "ASC" | "DESC";
}

export type PaginatedReviewsResponse = PaginatedResponse<Review>;

export interface CreateReviewDto {
  vehicle_id: string;
  rating: number;
  comment: string;
}
