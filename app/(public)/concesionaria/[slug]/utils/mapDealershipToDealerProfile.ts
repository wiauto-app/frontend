import type { DealershipDetail } from "@/services/dealerships/types/dealership.types";

import type { DealerProfile } from "../interfaces";
import { formatDealershipSchedules } from "./formatDealershipSchedules";

const formatMemberSince = (created_at: string): string => {
  const date = new Date(created_at);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("es-ES", {
    month: "short",
    year: "numeric",
  });
};

const computeTimeOnPlatform = (
  created_at: string,
): { years: number; months: number } | undefined => {
  const created = new Date(created_at);

  if (Number.isNaN(created.getTime())) {
    return undefined;
  }

  const now = new Date();

  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();

  if (now.getDate() < created.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
  };
};

type MapDealershipToDealerProfileInput = {
  dealership: DealershipDetail;
  publishedVehicles: number;
};

export const mapDealershipToDealerProfile = ({
  dealership,
  publishedVehicles,
}: MapDealershipToDealerProfileInput): DealerProfile => {
  const rating = dealership.rating ?? 0;

  const phone =
    dealership.show_phone !== false &&
    dealership.phone_code &&
    dealership.phone
      ? `${dealership.phone_code} ${dealership.phone}`.trim()
      : dealership.show_phone !== false
        ? dealership.phone || undefined
        : undefined;

  return {
    id: dealership.id,
    slug: dealership.slug,
    name: dealership.name,
    tagline: dealership.description?.slice(0, 120) || undefined,
    isVerified: dealership.is_featured,
    rating: Number(rating),
    reviewCount: dealership.reviews_count,
    memberSince: formatMemberSince(dealership.created_at),
    avatar: dealership.avatar_url ?? undefined,
    banner: dealership.banner_url ?? undefined,
    about: dealership.description,
    contact: {
      phone,
      email: dealership.email,
      location: dealership.address,
      schedule: formatDealershipSchedules(dealership.schedules),
    },
    quickStats: {
      publishedVehicles,
      reviewCount: dealership.reviews_count,
      yearsOnPlatform: computeTimeOnPlatform(dealership.created_at),
    },
  };
};
