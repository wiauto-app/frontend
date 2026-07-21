import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/interfaces/vehicle.interface";
import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import { cn } from "@/lib/utils";
import { BRAND_BLUE, BRAND_BLUE_LIGHT } from "./data/home-data";

type PopularCategoryCardProps = {
  category: Category;
};

export const PopularCategoryCard = ({ category }: PopularCategoryCardProps) => {
  const imageSrc = category.image_url
    ? getImageUrl(category.image_url)
    : null;

  return (
    <Link
      href={`/vehiculos?categoria=${category.slug}`}
      aria-label={`Explorar vehículos de categoría ${category.name}`}
      className={cn(
        "home-card-interactive group relative block h-full overflow-hidden rounded-2xl",
        "bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)]",
        "transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(0,97,242,0.18)]",
        "active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0061F2] focus-visible:ring-offset-2",
      )}
    >
      <div className="relative aspect-5/4 overflow-hidden sm:aspect-4/3">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={category.name}
            fill
            quality={80}
            className="home-card-image object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(max-width: 640px) 450px, 350px"
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
          className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/35 to-slate-950/5"
          aria-hidden
        />

        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,97,242,0.35) 0%, transparent 55%)",
          }}
          aria-hidden
        />

        <div
          className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 motion-reduce:transition-none"
          style={{ backgroundColor: BRAND_BLUE }}
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 sm:text-[11px]">
                Categoría
              </p>
              <h3 className="mt-1 truncate text-base font-bold text-white sm:text-lg lg:text-xl">
                {category.name}
              </h3>
            </div>

            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
                "border border-white/20 bg-white/10 text-white backdrop-blur-sm",
                "transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:scale-105 group-hover:border-transparent group-hover:bg-[#0061F2]",
                "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
              )}
              aria-hidden
            >
              <ArrowUpRight className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-12 motion-reduce:transition-none" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
