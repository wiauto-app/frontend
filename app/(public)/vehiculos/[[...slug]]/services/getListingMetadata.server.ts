import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import type { ListingMetadata } from "@/interfaces/listing-metadata.interface";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import { buildVehiclesQueryString } from "@/lib/vehicles/build-vehicles-query-params";

const FALLBACK_H1 = "Coches de ocasión";

export const FALLBACK_LISTING_METADATA: ListingMetadata = {
  h1: FALLBACK_H1,
  title: `${FALLBACK_H1} | WiAuto`,
  description: FALLBACK_H1,
  parts: {
    subject: "Coches",
    brand_model: null,
    location: null,
    modifiers: [],
  },
};

export const getListingMetadata = async (
  params: FindAllVehiclesParams,
): Promise<ListingMetadata> => {
  if (!API_URL) {
    return FALLBACK_LISTING_METADATA;
  }

  const token = (await cookies()).get("access_token")?.value;
  const query = buildVehiclesQueryString(params);

  try {
    const response = await fetch(
      `${API_URL}/v1/vehicles/listing-metadata${query}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return FALLBACK_LISTING_METADATA;
    }

    const body = (await response.json()) as {
      data?: ListingMetadata;
    };

    return body.data ?? FALLBACK_LISTING_METADATA;
  } catch {
    return FALLBACK_LISTING_METADATA;
  }
};
