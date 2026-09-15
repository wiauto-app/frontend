import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import type { DealershipDetail } from "@/services/dealerships/types/dealership.types";
import { V1_DEALERSHIPS_BY_SLUG } from "@/services/dealerships/route.constants";

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

export const getDealerBySlug = async (
  slug: string,
): Promise<DealerProfile | null> => {
  const dealership = await fetchDealershipBySlug(slug);
  if (!dealership) {
    return null;
  }

  return mapDealershipToDealerProfile({
    dealership,
    publishedVehicles: dealership.vehicles_count ?? 0,
  });
};

export const getDealershipDetailBySlug = async (
  slug: string,
): Promise<DealershipDetail | null> => fetchDealershipBySlug(slug);
