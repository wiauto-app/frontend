import { apiGet } from "@/lib/api";
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

export type FindDealershipReviewsParams = PaginationParams & {
  dealership_id: string;
};

export const dealershipReviewService = {
  findAll: async (
    params: FindDealershipReviewsParams,
  ): Promise<PaginatedResult<DealershipReview>> => {
    const search = new URLSearchParams();
    search.set("dealership_id", params.dealership_id);
    search.set("page", String(params.page ?? 1));
    search.set("limit", String(params.limit ?? 5));
    if (params.order_by) {
      search.set("order_by", params.order_by);
    }
    if (params.order_direction) {
      search.set("order_direction", params.order_direction);
    }

    const response = await apiGet<PaginatedResult<DealershipReview>>(
      `${V1_DEALERSHIP_REVIEWS}?${search.toString()}`,
    );
    return response.data;
  },
};
