import type { Metadata } from "next";

import { FRONTEND_URL } from "@/constants";
import {
  CONDITION_VEHICLE,
  STATUS_VEHICLE,
  TRANSMISSION_TYPE,
  type Vehicle,
} from "@/interfaces/vehicle.interface";
import { getImageUrl } from "@/lib/utils";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import { VEHICLES_LISTING_BASE_PATH } from "@/lib/vehicles/listing-url/constants";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";

import { absoluteUrl } from "./absolute-url";
import { buildBreadcrumbListJsonLd } from "./build-breadcrumb-list-json-ld";
import type { BreadcrumbItem } from "./breadcrumb.types";
import { NOINDEX_NOFOLLOW_ROBOTS } from "./noindex";

const BRAND_NAME = "WiAuto";
const BRAND_SUFFIX = ` | ${BRAND_NAME}`;
const META_TITLE_MAX_LENGTH = 60;
const META_DESCRIPTION_MAX_LENGTH = 160;

interface VehicleSeoCopy {
  title: string;
  description: string;
}

const formatEur = (price: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

const formatKm = (mileage: number): string =>
  `${mileage.toLocaleString("es-ES")} km`;

const hasPositiveNumber = (value: number | undefined | null): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const hasMileage = (value: number | undefined | null): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const joinParts = (parts: Array<string | null | undefined>): string =>
  parts.filter((part): part is string => Boolean(part)).join(" ");

const joinSpanishList = (items: string[]): string => {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
};

const resolveConditionLabel = (condition: Vehicle["condition"] | undefined): string | null => {
  if (condition === CONDITION_VEHICLE.NEW) {
    return "nuevo";
  }

  if (condition === CONDITION_VEHICLE.USED) {
    return "de ocasión";
  }

  return null;
};

const resolveTransmissionLabel = (
  transmission: Vehicle["transmission_type"] | undefined,
): string | null => {
  if (transmission === TRANSMISSION_TYPE.MANUAL) {
    return "manual";
  }

  if (transmission === TRANSMISSION_TYPE.AUTOMATIC) {
    return "automático";
  }

  return null;
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

const buildVehicleMetaTitle = (vehicle: Vehicle): string => {
  const name = getVehicleDisplayName(vehicle);
  const year = vehicle.version.year?.year ? String(vehicle.version.year.year) : null;
  const conditionLabel = resolveConditionLabel(vehicle.condition);
  const priceLabel = hasPositiveNumber(vehicle.price) ? formatEur(vehicle.price) : null;
  const pricePart = priceLabel ? `· ${priceLabel}` : null;

  const cores = [
    joinParts([name, year, conditionLabel, pricePart]),
    joinParts([name, year, conditionLabel]),
    joinParts([name, year]),
    name,
  ];

  for (const core of cores) {
    const title = `${core}${BRAND_SUFFIX}`;
    if (title.length <= META_TITLE_MAX_LENGTH) {
      return title;
    }
  }

  const maxCoreLength = META_TITLE_MAX_LENGTH - BRAND_SUFFIX.length;
  return `${truncateAtWord(name, maxCoreLength)}${BRAND_SUFFIX}`;
};

const buildOpening = (vehicle: Vehicle, includePlace: boolean): string => {
  const name = getVehicleDisplayName(vehicle);
  const year = vehicle.version.year?.year;
  const place = includePlace
    ? vehicle.address_details?.municipality || vehicle.address_details?.province
    : null;
  const yearPart = year ? ` del ${year}` : "";
  const placePart = place ? `, ${place}` : "";

  return `${name}${yearPart} en venta en ${BRAND_NAME}${placePart}.`;
};

const buildSpecSentence = (vehicle: Vehicle, detail: "full" | "core" | "mileage"): string | null => {
  const bodyName = vehicle.version.body_type?.name;
  const fuelName = vehicle.version.fuel_type?.name?.toLocaleLowerCase("es-ES");
  const bodyFuel = joinParts([bodyName, fuelName]);
  const powerPart = hasPositiveNumber(vehicle.power) ? `${vehicle.power} CV` : null;
  const transmission = resolveTransmissionLabel(vehicle.transmission_type);
  const transmissionPart = transmission ? `cambio ${transmission}` : null;
  const mileagePart = hasMileage(vehicle.mileage) ? formatKm(vehicle.mileage) : null;

  const partsByDetail = {
    full: [bodyFuel, powerPart, transmissionPart, mileagePart],
    core: [bodyFuel, powerPart, mileagePart],
    mileage: [mileagePart],
  } satisfies Record<string, Array<string | null>>;

  const items = partsByDetail[detail].filter((part): part is string => Boolean(part));
  if (items.length === 0) {
    return null;
  }

  return `${joinSpanishList(items)}.`;
};

const buildVehicleMetaDescription = (vehicle: Vehicle): string => {
  const priceSentence = hasPositiveNumber(vehicle.price)
    ? `Precio: ${formatEur(vehicle.price)}.`
    : null;
  const details = ["full", "core", "mileage"] as const;

  for (const detail of details) {
    for (const includePlace of [true, false]) {
      const description = joinParts([
        buildOpening(vehicle, includePlace),
        buildSpecSentence(vehicle, detail),
        priceSentence,
      ]);

      if (description.length <= META_DESCRIPTION_MAX_LENGTH) {
        return description;
      }
    }
  }

  return buildOpening(vehicle, false);
};

const buildVehicleSeoCopy = (vehicle: Vehicle): VehicleSeoCopy => ({
  title: buildVehicleMetaTitle(vehicle),
  description: buildVehicleMetaDescription(vehicle),
});

const toIsoDate = (value: string | undefined | null): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

export const buildVehicleBreadcrumbItems = (vehicle: Vehicle): BreadcrumbItem[] => {
  const makeSlug = vehicle.version.make.slug;
  const modelSlug = vehicle.version.model.slug;
  const title = getVehicleDisplayName(vehicle);

  return [
    { label: "Inicio", href: "/" },
    { label: "Vehículos", href: VEHICLES_LISTING_BASE_PATH },
    {
      label: vehicle.version.make.name,
      href: buildVehicleListingHref({ makes_slugs: [makeSlug] }),
    },
    {
      label: vehicle.version.model.name,
      href: buildVehicleListingHref({
        makes_slugs: [makeSlug],
        models_slugs: [modelSlug],
      }),
    },
    { label: title },
  ];
};

export const buildVehicleDetailMetadata = (vehicle: Vehicle): Metadata => {
  const { title, description } = buildVehicleSeoCopy(vehicle);
  const canonical = `${FRONTEND_URL}/vehiculo/${vehicle.id}`;
  const images = vehicle.images
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((image) => ({
      url: getImageUrl(image.url),
    }));

  return {
    title,
    description,
    ...(vehicle.status !== STATUS_VEHICLE.ACTIVE
      ? { robots: NOINDEX_NOFOLLOW_ROBOTS }
      : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
};

export const buildVehicleDetailJsonLd = (vehicle: Vehicle) => {
  const breadcrumbItems = buildVehicleBreadcrumbItems(vehicle);
  const { title, description } = buildVehicleSeoCopy(vehicle);
  const vehicleUrl = absoluteUrl(`/vehiculo/${vehicle.id}`);
  const vehicleId = `${vehicleUrl}#vehicle`;
  const datePublished = toIsoDate(vehicle.created_at);
  const dateModified = toIsoDate(vehicle.updated_at);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbListJsonLd(breadcrumbItems),
      {
        "@type": "WebPage",
        "@id": `${vehicleUrl}#webpage`,
        url: vehicleUrl,
        name: title,
        description,
        inLanguage: "es-ES",
        isPartOf: absoluteUrl("/"),
        mainEntity: { "@id": vehicleId },
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
      },
      {
        "@type": "Car",
        "@id": vehicleId,
        name: getVehicleDisplayName(vehicle),
        description,
        image: vehicle.images.map((image) => getImageUrl(image.url)),
        brand: {
          "@type": "Brand",
          name: vehicle.version.make.name,
        },
        model: vehicle.version.model.name,
        ...(vehicle.version.year?.year
          ? { vehicleModelDate: String(vehicle.version.year.year) }
          : {}),
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: vehicle.mileage,
          unitCode: "KMT",
        },
        offers: {
          "@type": "Offer",
          price: vehicle.price,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: vehicleUrl,
        },
      },
    ],
  };
};

export interface VehicleDetailSeo {
  breadcrumbItems: BreadcrumbItem[];
  metadata: Metadata;
  jsonLdGraph: ReturnType<typeof buildVehicleDetailJsonLd>;
}

export const buildVehicleDetailSeo = (vehicle: Vehicle): VehicleDetailSeo => ({
  breadcrumbItems: buildVehicleBreadcrumbItems(vehicle),
  metadata: buildVehicleDetailMetadata(vehicle),
  jsonLdGraph: buildVehicleDetailJsonLd(vehicle),
});
