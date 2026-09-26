import type { Metadata } from "next";

import { FRONTEND_URL } from "@/constants";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";

import { absoluteUrl } from "./absolute-url";
import { NOINDEX_ROBOTS } from "./noindex";

const BRAND_NAME = "WiAuto";
const BRAND_SUFFIX = ` | ${BRAND_NAME}`;
const META_TITLE_MAX_LENGTH = 60;
const META_DESCRIPTION_MAX_LENGTH = 160;
const DEFAULT_TITLE = `Coches de segunda mano y ocasión${BRAND_SUFFIX}`;
const DEFAULT_DESCRIPTION =
  "Coches de segunda mano y ocasión en WiAuto. Compara precio, kilómetros y ubicación, y contacta con particulares y concesionarios.";
const FILTERED_DESCRIPTION_TAIL =
  "Compara precio, kilómetros y ubicación, y contacta con particulares y concesionarios.";
const FILTERED_DESCRIPTION_SHORT = "Compara precio, kilómetros y ubicación.";

const ORDER_SUFFIXES = [
  "más recientes",
  "más antiguos",
  "más baratos",
  "más caros",
  "menor kilometraje",
  "mayor kilometraje",
  "más vistos",
  "menos vistos",
];

const DEFAULT_HEADINGS = new Set(["", "Vehículos", "Vehículos de segunda mano"]);

export interface VehicleListingCopy {
  title: string;
  description: string;
}

export interface VehicleListingJsonLdInput {
  title: string;
  description: string;
  canonicalUrl: string;
  vehicles: VehicleListItem[];
  page: number;
  limit: number;
}

const stripOrderSuffix = (title: string): string => {
  const trimmed = title.trim();
  const suffix = ORDER_SUFFIXES.find((label) => trimmed.endsWith(label));
  if (!suffix) {
    return trimmed;
  }

  return trimmed.slice(0, -suffix.length).trim();
};

const truncateAtWord = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.6) {
    return sliced.slice(0, lastSpace).trimEnd();
  }

  return sliced.trimEnd();
};

const buildFilteredDescription = (heading: string): string => {
  const lead = `${heading} en ${BRAND_NAME}.`;
  const full = `${lead} ${FILTERED_DESCRIPTION_TAIL}`;
  if (full.length <= META_DESCRIPTION_MAX_LENGTH) {
    return full;
  }

  const medium = `${lead} ${FILTERED_DESCRIPTION_SHORT}`;
  if (medium.length <= META_DESCRIPTION_MAX_LENGTH) {
    return medium;
  }

  if (lead.length <= META_DESCRIPTION_MAX_LENGTH) {
    return lead;
  }

  const maxHeadingLength = META_DESCRIPTION_MAX_LENGTH - ` en ${BRAND_NAME}.`.length;
  return `${truncateAtWord(heading, maxHeadingLength)} en ${BRAND_NAME}.`;
};

export const buildVehicleListingCopy = (filterTitle: string): VehicleListingCopy => {
  const heading = stripOrderSuffix(filterTitle);
  if (DEFAULT_HEADINGS.has(heading)) {
    return {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    };
  }

  const title = `${heading}${BRAND_SUFFIX}`;
  return {
    title:
      title.length <= META_TITLE_MAX_LENGTH
        ? title
        : `${truncateAtWord(heading, META_TITLE_MAX_LENGTH - BRAND_SUFFIX.length)}${BRAND_SUFFIX}`,
    description: buildFilteredDescription(heading),
  };
};

export const buildVehicleListingMetadata = (
  filterTitle: string,
  options: { canonical: string; noindex: boolean },
): Metadata => {
  const { title, description } = buildVehicleListingCopy(filterTitle);
  const imageUrl = `${FRONTEND_URL}/images/og-image.png`;

  return {
    title,
    description,
    ...(options.noindex ? { robots: NOINDEX_ROBOTS } : {}),
    alternates: {
      canonical: options.canonical,
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: BRAND_NAME,
      title,
      description,
      url: options.canonical,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
};

export const buildVehicleListingJsonLd = ({
  title,
  description,
  canonicalUrl,
  vehicles,
  page,
  limit,
}: VehicleListingJsonLdInput) => {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : vehicles.length;
  const offset = (safePage - 1) * safeLimit;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: canonicalUrl,
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      position: offset + index + 1,
      url: absoluteUrl(`/vehiculo/${vehicle.id}`),
      name: getVehicleDisplayName(vehicle),
    })),
  };
};
