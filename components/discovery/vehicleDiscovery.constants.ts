import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import type { DiscoveryPillLink, QuickLink } from "./types";

export const PLUG_IN_HYBRID_FUEL_SLUG = "hibrido-enchufable";

export const DISCOVERY_DEFAULT_TITLE =
  "Encuentra tu vehículo de bajas emisiones";

export const DISCOVERY_QUICK_LINKS: QuickLink[] = [
  {
    label: "Coches eléctricos",
    description: "Cero emisiones y máxima eficiencia",
    href: buildVehicleListingHref({ fuel_type_slugs: ["electrico"] }),
  },
  {
    label: "Coches híbridos",
    description: "Combustión y motor eléctrico",
    href: buildVehicleListingHref({ fuel_type_slugs: ["hibrido"] }),
  },
  {
    label: "Híbridos enchufables",
    description: "Recarga en casa o en punto de carga",
    href: buildVehicleListingHref({
      fuel_type_slugs: [PLUG_IN_HYBRID_FUEL_SLUG],
    }),
  },
];

export const DISCOVERY_COLOR_LINKS: DiscoveryPillLink[] = [
  {
    label: "Blanco",
    href: buildVehicleListingHref({ color_slugs: ["blanco"] }),
  },
  {
    label: "Negro",
    href: buildVehicleListingHref({ color_slugs: ["negro"] }),
  },
  {
    label: "Gris",
    href: buildVehicleListingHref({ color_slugs: ["gris"] }),
  },
  {
    label: "Azul",
    href: buildVehicleListingHref({ color_slugs: ["azul"] }),
  },
  {
    label: "Rojo",
    href: buildVehicleListingHref({ color_slugs: ["rojo"] }),
  },
];
