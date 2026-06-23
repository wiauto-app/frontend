import type { DealershipDetail } from "@/services/dealerships/types/dealership.types";
import type { DealershipReview } from "@/services/dealerships/dealershipReviewService";

import type {
  DealerProfile,
  DealerProfileReview,
  DealerRatingDistribution,
} from "../interfaces";

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

const computeYearsOnPlatform = (created_at: string): number | undefined => {
  const created = new Date(created_at);
  if (Number.isNaN(created.getTime())) {
    return undefined;
  }
  const years = Math.floor(
    (Date.now() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
  );
  return Math.max(1, years);
};

const buildRatingDistribution = (
  reviews: DealershipReview[],
): DealerRatingDistribution[] =>
  [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));

const mapReviewToProfileReview = (
  review: DealershipReview,
): DealerProfileReview => ({
  id: review.id,
  author: "Cliente verificado",
  rating: review.rating,
  comment: review.comment,
});

type MapDealershipToDealerProfileInput = {
  dealership: DealershipDetail;
  reviews: DealershipReview[];
  reviewTotal: number;
  publishedVehicles: number;
};

export const mapDealershipToDealerProfile = ({
  dealership,
  reviews,
  reviewTotal,
  publishedVehicles,
}: MapDealershipToDealerProfileInput): DealerProfile => {
  const rating = dealership.rating ?? 0;
  const positive_reviews = reviews.filter((review) => review.rating >= 4).length;
  const positive_reviews_percent =
    reviews.length > 0
      ? Math.round((positive_reviews / reviews.length) * 100)
      : undefined;

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
    rating,
    reviewCount: reviewTotal,
    memberSince: formatMemberSince(dealership.created_at),
    avatar: dealership.avatar_url ?? undefined,
    banner: dealership.banner_url ?? undefined,
    about: dealership.description,
    contact: {
      phone,
      email: dealership.email,
      location: dealership.address,
    },
    stats: {
      score: rating,
    },
    quickStats: {
      publishedVehicles,
      positiveReviewsPercent: positive_reviews_percent,
      yearsOnPlatform: computeYearsOnPlatform(dealership.created_at),
    },
    reviews: reviews.slice(0, 5).map(mapReviewToProfileReview),
    ratingDistribution: buildRatingDistribution(reviews),
  };
};
