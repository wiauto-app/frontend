import { BODY_TYPE_OPTIONS, FUEL_OPTIONS } from "@/app/(public)/vehiculos/constants";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { HERO_PRICE_UNTIL_OPTIONS } from "@/interfaces/hero-facet.interface";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import {
  DISCOVERY_COLOR_LINKS,
  DISCOVERY_MAKES_LIMIT,
  DISCOVERY_QUICK_LINKS,
  PLUG_IN_HYBRID_FUEL_SLUG,
} from "./vehicleDiscovery.constants";
import type {
  DiscoveryAccordionSection,
  DiscoveryCatalogItem,
  QuickLink,
} from "./types";
import { MapPinIcon, Settings2, Tag } from "lucide-react";

const sortByVehicleCount = (
  items: HeroCatalogFacetItem[],
): HeroCatalogFacetItem[] =>
  [...items]
    .filter((item) => item.vehicle_count > 0)
    .sort((left, right) => right.vehicle_count - left.vehicle_count);

export const buildDefaultQuickLinks = (): QuickLink[] => DISCOVERY_QUICK_LINKS;

export const buildVehicleDiscoverySections = (
  provinces: DiscoveryCatalogItem[],
  makes: HeroCatalogFacetItem[],
): DiscoveryAccordionSection[] => {
  const pricePills = HERO_PRICE_UNTIL_OPTIONS.map((untilPrice) => ({
    label: `Hasta ${untilPrice.toLocaleString("es-ES")} €`,
    href: buildVehicleListingHref({ until_price: untilPrice }),
  }));

  const fuelPills = [
    ...FUEL_OPTIONS.map((fuel) => ({
      label: fuel.label,
      href: buildVehicleListingHref({ fuel_type_slugs: [fuel.slug] }),
    })),
    {
      label: "Híbrido enchufable",
      href: buildVehicleListingHref({
        fuel_type_slugs: [PLUG_IN_HYBRID_FUEL_SLUG],
      }),
    },
  ];

  const bodyTypePills = BODY_TYPE_OPTIONS.map((bodyType) => ({
    label: bodyType.label,
    href: buildVehicleListingHref({ type_slug: bodyType.slug }),
  }));

  return [
    {
      id: "provinces",
      title: "Por provincia",
      Icon: MapPinIcon,
      pills: provinces.map((province) => ({
        label: province.name,
        href: buildVehicleListingHref({
          provinces_slugs: [province.slug],
        }),
      })),
    },
    {
      id: "makes",
      title: "Por marca",
      Icon:Tag,
      pills: sortByVehicleCount(makes)
        .slice(0, DISCOVERY_MAKES_LIMIT)
        .map((make) => ({
          label: make.name,
          href: buildVehicleListingHref({ makes_slugs: [make.slug] }),
        })),
    },
    {
      id: "more-filters",
      title: "Más filtros",
      Icon:Settings2,
      pills: [
        ...pricePills,
        ...fuelPills,
        ...bodyTypePills,
        ...DISCOVERY_COLOR_LINKS,
      ],
    },
  ];
};
