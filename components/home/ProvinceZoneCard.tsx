import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import { cn } from "@/lib/utils";
import type { ProvinceZoneItem } from "@/lib/locations/buildProvinceZones";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import { BRAND_BLUE_LIGHT } from "./data/home-data";

type ProvinceZoneCardProps = {
  province: ProvinceZoneItem;
};

const formatVehicleCountLabel = (count: number): string => {
  const formatted = count.toLocaleString("es-ES", {
    maximumFractionDigits: 0,
  });

  return count === 1 ? `${formatted} anuncio` : `${formatted} anuncios`;
};

export const ProvinceZoneCard = ({ province }: ProvinceZoneCardProps) => {
  const image_src = province.image_url ? getImageUrl(province.image_url) : null;

  const href = buildVehicleListingHref({
    provinces_slugs: [province.slug],
  });

  const sizes = `
    
    250px
  `;

  return (
    <Link
      href={href}
      aria-label={`Explorar vehículos en ${province.name}`}
      className={cn(
        "home-card-interactive group relative block h-full overflow-hidden rounded-2xl",
        " shadow-[0_4px_20px_rgba(15,23,42,0.08)]",
        "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(0,97,242,0.18)]",
        "active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0061F2] focus-visible:ring-offset-2",
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
        {image_src ? (
          <Image
            src={image_src}
            alt={province.name}
            fill
            quality={80}
            className="home-card-image object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes={sizes}
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

        {/* Overlay para mejorar la legibilidad del texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.45) 40%, rgba(0,0,0,.15) 65%, transparent 100%)",
          }}
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 z-10  flex items-center justify-center px-2 pb-2">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="mt-1 truncate text-sm font-bold text-white sm:text-base lg:text-lg text-center">
                {province.name}
              </h3>
              <p className="text-xs font-medium text-white/80 text-center">
                {formatVehicleCountLabel(province.vehicle_count)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
