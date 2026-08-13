import type { Metadata } from "next";

import { FRONTEND_URL } from "@/constants";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import { getImageUrl } from "@/lib/utils";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import { VEHICLES_LISTING_BASE_PATH } from "@/lib/vehicles/listing-url/constants";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";

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

const buildVehicleDescriptionFallback = (vehicle: Vehicle): string => {
  const makeName = vehicle.version.make.name;
  const modelName = vehicle.version.model.name;
  const year = vehicle.version.year?.year;
  const parts = [makeName, modelName, year ? String(year) : ""].filter(Boolean);
  return `Vehículo ${parts.join(" ")} en WiAuto`.trim();
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
  const title = getVehicleDisplayName(vehicle);
  const description =
    truncateDescription(vehicle.description) ||
    buildVehicleDescriptionFallback(vehicle);
  const canonical = `${FRONTEND_URL}/vehiculo/${vehicle.id}`;
  const images = vehicle.images.sort((a, b) => a.order - b.order).map((image) => ({
    url: getImageUrl(image.url),
  }));
  console.log("images", images);

  return {
    title,
    description,
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
  const title = getVehicleDisplayName(vehicle);
  const description =
    truncateDescription(vehicle.description) ||
    buildVehicleDescriptionFallback(vehicle);
  const vehicleUrl = absoluteUrl(`/vehiculo/${vehicle.id}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildBreadcrumbListJsonLd(breadcrumbItems),
      {
        "@type": "Car",
        name: title,
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

export type VehicleDetailSeo = {
  breadcrumbItems: BreadcrumbItem[];
  metadata: Metadata;
  jsonLdGraph: ReturnType<typeof buildVehicleDetailJsonLd>;
};

export const buildVehicleDetailSeo = (vehicle: Vehicle): VehicleDetailSeo => ({
  breadcrumbItems: buildVehicleBreadcrumbItems(vehicle),
  metadata: buildVehicleDetailMetadata(vehicle),
  jsonLdGraph: buildVehicleDetailJsonLd(vehicle),
});
