import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import { VEHICLES_LISTING_BASE_PATH } from "@/lib/vehicles/listing-url/constants";
import type { ProvinceQuickBadgeItem } from "./utils/build-province-badges";

export interface ProvinceQuickBadgesProps {
  provinces: ProvinceQuickBadgeItem[];
  limit?: number;
  viewAllHref?: string;
}

export const ProvinceQuickBadges = ({
  provinces,
  limit = 7,
  viewAllHref = VEHICLES_LISTING_BASE_PATH,
}: ProvinceQuickBadgesProps) => {
  const visible_provinces = provinces.slice(0, limit);

  if (visible_provinces.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 pt-3">
      {visible_provinces.map((province) => (
        <Badge
          key={province.slug}
          variant="outline"
          className="px-3 py-1 text-sm"
          render={
            <Link
              href={buildVehicleListingHref({
                provinces_slugs: [province.slug],
              })}
              aria-label={`Filtrar por ${province.name}`}
            />
          }
        >
          {province.name}
        </Badge>
      ))}
      <Badge
        variant="outline"
        className="px-3 py-1 text-sm"
        render={<Link href={viewAllHref} aria-label="Ver todas las provincias" />}
      >
        Ver todas
      </Badge>
    </div>
  );
};
