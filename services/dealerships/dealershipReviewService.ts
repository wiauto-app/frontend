import { apiGet, apiPost, type ApiResponse } from "@/lib/api";
import type { PaginatedResult, PaginationParams } from "@/types/general.types";
import { V1_DEALERSHIP_REVIEWS } from "../dealerships/route.constants";

export type DealershipReview = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  profile_id: string;
  dealership_id: string;
};

export type DealershipReviewListItem = DealershipReview & {
  author: string;
  avatar_url: string | null;
};

export type FindDealershipReviewsParams = PaginationParams & {
  dealership_id: string;
};

export type CreateDealershipReviewInput = {
  dealership_id: string;
  rating: number;
  comment: string;
};

export type DealershipReviewsPage = PaginatedResult<DealershipReviewListItem> & {
  average_rating: number | null;
};

type CreateDealershipReviewResponse = {
  review: DealershipReview;
};

export const dealershipReviewService = {
  create: (
    input: CreateDealershipReviewInput,
  ): Promise<ApiResponse<CreateDealershipReviewResponse>> =>
    apiPost<CreateDealershipReviewResponse>(V1_DEALERSHIP_REVIEWS, input),

  getByDealershipId: async (
    params: FindDealershipReviewsParams,
  ): Promise<DealershipReviewsPage> => {
    const page = params.page ?? 1;
    const limit = params.limit ?? 5;

    try {
      const response = await apiGet<DealershipReviewsPage>(
        V1_DEALERSHIP_REVIEWS,
        {
          dealership_id: params.dealership_id,
          page,
          limit,
          order_by: params.order_by,
          order_direction: params.order_direction,
        },
      );

      if (!response.ok || !response.data) {
        return { data: [], total: 0, page, limit, average_rating: null };
      }

      return response.data;
    } catch {
      return { data: [], total: 0, page, limit, average_rating: null };
    }
  },
};
