import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import { VEHICLES_LISTING_BASE_PATH } from "@/lib/vehicles/listing-url/constants";
import { getImageUrl } from "@/lib/utils";
import type { MakeLogoBadgeItem } from "./utils/build-make-logo-badges";

export interface MakeLogoQuickBadgesProps {
  makes: MakeLogoBadgeItem[];
  limit?: number;
  viewAllHref?: string;
}

export const MakeLogoQuickBadges = ({
  makes,
  limit = 9,
  viewAllHref = VEHICLES_LISTING_BASE_PATH,
}: MakeLogoQuickBadgesProps) => {
  const visible_makes = makes
    .filter((make) => Boolean(make.image_url?.trim()))
    .slice(0, limit);

  if (visible_makes.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3">
      {visible_makes.map((make) => (
        <Badge
          key={make.slug}
          variant="outline"
          className="size-10 rounded-full p-0"
          render={
            <Link
              href={buildVehicleListingHref({ makes_slugs: [make.slug] })}
              aria-label={`Filtrar por ${make.name}`}
              className="flex size-full items-center justify-center overflow-hidden rounded-full"
            />
          }
        >
          <Image
            src={getImageUrl(make.image_url)}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-full object-contain"
            aria-hidden
          />
        </Badge>
      ))}
      <Badge
        variant="outline"
        className="px-3 py-1 text-sm"
        render={<Link href={viewAllHref} aria-label="Ver todas las marcas" />}
      >
        Ver todas
      </Badge>
    </div>
  );
};
