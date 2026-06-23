import type { Metadata } from "next";

import { FRONTEND_URL } from "@/constants";
import type { DealershipDetail } from "@/services/dealerships/types/dealership.types";
import { getImageUrl } from "@/lib/utils";

import { absoluteUrl } from "./absolute-url";
import { buildBreadcrumbListJsonLd } from "./build-breadcrumb-list-json-ld";
import type { BreadcrumbItem } from "./breadcrumb.types";

const truncateDescription = (
  text: string | undefined | null,
  maxLength = 160,
): string => {
  if (!text?.trim()) {
    return "";
  }

  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 3).trimEnd()}...`;
};

const buildDealershipDescriptionFallback = (dealership: DealershipDetail): string =>
  `Perfil de ${dealership.name} en WiAuto`;

const buildVisiblePhone = (dealership: DealershipDetail): string | undefined => {
  if (dealership.show_phone === false) {
    return undefined;
  }

  if (dealership.phone_code && dealership.phone) {
    return `${dealership.phone_code} ${dealership.phone}`.trim();
  }

  return dealership.phone || undefined;
};

export const buildDealershipBreadcrumbItems = (
  dealership: DealershipDetail,
): BreadcrumbItem[] => [
  { label: "Inicio", href: "/" },
  { label: "Concesionarios", href: "/concesionarias" },
  { label: dealership.name },
];

export const buildDealershipDetailMetadata = (
  dealership: DealershipDetail,
): Metadata => {
  const title = `${dealership.name} | Concesionarios | WiAuto`;
  const description =
    truncateDescription(dealership.description) ||
    buildDealershipDescriptionFallback(dealership);
  const canonical = `${FRONTEND_URL}/concesionaria/${dealership.slug}`;
  const ogImage = dealership.banner_url
    ? getImageUrl(dealership.banner_url)
    : dealership.avatar_url
      ? getImageUrl(dealership.avatar_url)
      : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${dealership.name} | WiAuto`,
      description,
      url: canonical,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${dealership.name} | WiAuto`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
};

type BuildDealershipDetailJsonLdInput = {
  dealership: DealershipDetail;
  reviewCount?: number;
  rating?: number;
};

export const buildDealershipDetailJsonLd = ({
  dealership,
  reviewCount = 0,
  rating = dealership.rating ?? 0,
}: BuildDealershipDetailJsonLdInput) => {
  const breadcrumbItems = buildDealershipBreadcrumbItems(dealership);
  const description =
    truncateDescription(dealership.description) ||
    buildDealershipDescriptionFallback(dealership);
  const dealershipUrl = absoluteUrl(`/concesionaria/${dealership.slug}`);
  const telephone = buildVisiblePhone(dealership);
  const image = dealership.banner_url
    ? getImageUrl(dealership.banner_url)
    : dealership.avatar_url
      ? getImageUrl(dealership.avatar_url)
      : undefined;

  const autoDealer: Record<string, unknown> = {
    "@type": "AutoDealer",
    name: dealership.name,
    description,
    url: dealershipUrl,
    ...(image ? { image } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: dealership.address,
    },
    email: dealership.email,
  };

  if (telephone) {
    autoDealer.telephone = telephone;
  }

  if (
    dealership.lat !== undefined &&
    dealership.lng !== undefined &&
    !Number.isNaN(dealership.lat) &&
    !Number.isNaN(dealership.lng)
  ) {
    autoDealer.geo = {
      "@type": "GeoCoordinates",
      latitude: dealership.lat,
      longitude: dealership.lng,
    };
  }

  if (reviewCount > 0 && rating > 0) {
    autoDealer.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [buildBreadcrumbListJsonLd(breadcrumbItems), autoDealer],
  };
};

export type DealershipDetailSeo = {
  breadcrumbItems: BreadcrumbItem[];
  metadata: Metadata;
  jsonLdGraph: ReturnType<typeof buildDealershipDetailJsonLd>;
};

type BuildDealershipDetailSeoInput = {
  dealership: DealershipDetail;
  reviewCount?: number;
  rating?: number;
};

export const buildDealershipDetailSeo = ({
  dealership,
  reviewCount,
  rating,
}: BuildDealershipDetailSeoInput): DealershipDetailSeo => ({
  breadcrumbItems: buildDealershipBreadcrumbItems(dealership),
  metadata: buildDealershipDetailMetadata(dealership),
  jsonLdGraph: buildDealershipDetailJsonLd({
    dealership,
    reviewCount,
    rating,
  }),
});
