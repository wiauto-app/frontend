import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import type { DealershipDetail } from "@/services/dealerships/types/dealership.types";
import type { DealershipReview } from "@/services/dealerships/dealershipReviewService";
import { V1_DEALERSHIPS_BY_SLUG, V1_DEALERSHIP_REVIEWS } from "@/services/dealerships/route.constants";
import type { PaginatedResult } from "@/types/general.types";

import type { DealerProfile } from "../interfaces";
import { mapDealershipToDealerProfile } from "../utils/mapDealershipToDealerProfile";

const fetchDealershipBySlug = async (
  slug: string,
): Promise<DealershipDetail | null> => {
  if (!API_URL) {
    return null;
  }

  const token = (await cookies()).get("access_token")?.value;

  try {
    const response = await fetch(`${API_URL}${V1_DEALERSHIPS_BY_SLUG}/${slug}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as { data?: DealershipDetail };
    return body.data ?? null;
  } catch {
    return null;
  }
};

const fetchDealershipReviews = async (
  dealership_id: string,
  limit = 100,
): Promise<{ reviews: DealershipReview[]; total: number }> => {
  if (!API_URL) {
    return { reviews: [], total: 0 };
  }

  const token = (await cookies()).get("access_token")?.value;
  const query = new URLSearchParams({
    dealership_id,
    page: "1",
    limit: String(limit),
    order_by: "created_at",
    order_direction: "DESC",
  });

  try {
    const response = await fetch(
      `${API_URL}${V1_DEALERSHIP_REVIEWS}?${query.toString()}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { reviews: [], total: 0 };
    }

    const body = (await response.json()) as {
      data?: PaginatedResult<DealershipReview>;
    };
    const payload = body.data;

    return {
      reviews: payload?.data ?? [],
      total: payload?.total ?? 0,
    };
  } catch {
    return { reviews: [], total: 0 };
  }
};

export const getDealerBySlug = async (
  slug: string,
): Promise<DealerProfile | null> => {
  const dealership = await fetchDealershipBySlug(slug);
  if (!dealership) {
    return null;
  }

  const { reviews, total: review_total } = await fetchDealershipReviews(
    dealership.id,
  );

  return mapDealershipToDealerProfile({
    dealership,
    reviews,
    reviewTotal: review_total,
    publishedVehicles: dealership.vehicles_count ?? 0,
  });
};

export const getDealershipDetailBySlug = async (
  slug: string,
): Promise<DealershipDetail | null> => fetchDealershipBySlug(slug);

export const getDealershipReviewsByDealershipId = async (
  dealership_id: string,
) => fetchDealershipReviews(dealership_id);
