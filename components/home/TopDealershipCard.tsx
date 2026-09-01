import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DealershipListItem } from "@/services/dealerships/types/dealership.types";
import { BRAND_BLUE_LIGHT } from "./data/home-data";
import { DealershipRatingStars } from "./DealershipRatingStars";

interface TopDealershipCardProps {
  dealership: DealershipListItem;
}

/** Ancho CSS real del slide (basis 78% / 1/2 / 1/3 / 1/4), no el viewport. */
const DEALERSHIP_CARD_IMAGE_SIZES =
  "(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 300px, 240px";

export const TopDealershipCard = ({
  dealership,
}: TopDealershipCardProps) => {
  const imagePath = dealership.banner_url ?? dealership.avatar_url ?? null;
  const imageSrc = imagePath ? getImageUrl(imagePath) : null;

  return (
    <Link
      href={`/concesionaria/${dealership.slug}`}
      aria-label={`Ver perfil de ${dealership.name}`}
      className={cn(
        "home-card-interactive group relative block h-full overflow-hidden rounded-2xl",
        "bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)]",
        "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(0,97,242,0.18)]",
        "active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0061F2] focus-visible:ring-offset-2"
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={dealership.name}
            fill
            quality={70}
            sizes={DEALERSHIP_CARD_IMAGE_SIZES}
            unoptimized={false}
            className="home-card-image object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND_BLUE_LIGHT} 0%, rgba(0,97,242,0.25) 100%)`,
            }}
            aria-hidden
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 40%, rgba(0,0,0,.15) 65%, transparent 100%)",
          }}
          aria-hidden
        />

        {dealership.is_featured && (
          <Badge
            className="absolute right-2 top-2 z-10 border-white/20 bg-[#0061F2] text-white shadow-sm"
            aria-label="Concesionario destacado"
          >
            Destacado
          </Badge>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 px-3 pb-3">
          <h3 className="w-full truncate text-center text-sm font-bold text-white sm:text-base lg:text-lg">
            {dealership.name}
          </h3>

          <DealershipRatingStars rating={Number(dealership.rating)} />
        </div>
      </div>
    </Link>
  );
};