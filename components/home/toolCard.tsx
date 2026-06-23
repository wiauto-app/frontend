import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { BRAND_BLUE } from "./data/home-data";
import type { StrapiCard } from "./types/home-page.types";

const DEFAULT_BACKGROUND = BRAND_BLUE;

const pickImageUrl = (item: StrapiCard): string | null => {
  const media = item.imagen;

  return (
    getStrapiMediaUrl(media.formats?.medium?.url) ??
    getStrapiMediaUrl(media.formats?.small?.url) ??
    getStrapiMediaUrl(media.url)
  );
};

type ToolCardProps = {
  item: StrapiCard;
};

export const ToolCard = ({ item }: ToolCardProps) => {
  const backgroundColor = item.colorFondo?.trim() || DEFAULT_BACKGROUND;
  const imageUrl = pickImageUrl(item);
  const imageAlt = item.imagen.alternativeText?.trim() || item.titulo;
  const ctaLabel = item.boton.label?.trim() || "Ver más";
  const ctaAriaLabel = `${ctaLabel}: ${item.titulo}`;

  return (
    <Card
      className={cn(
        "group/card h-full overflow-hidden border-0 py-0 text-white shadow-[0_4px_20px_rgba(15,23,42,0.12)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,97,242,0.22)]",
      )}
      style={{ backgroundColor }}
    >
      <CardContent className="relative flex h-full min-h-[180px] flex-col gap-4 p-0 sm:min-h-[200px] sm:flex-row sm:items-stretch sm:gap-0">
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/10"
          aria-hidden
        />

        <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 p-5 sm:p-6 lg:p-7">
          <div className="space-y-2">
            <h3 className="text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
              {item.titulo}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
              {item.descripcion}
            </p>
          </div>
          <Link href={item.boton.url} aria-label={ctaAriaLabel}>
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "mt-auto w-fit border-white/20 bg-white text-slate-900",
                "hover:bg-white/90 focus-visible:ring-white/40",
                "group-hover/card:shadow-md",
              )}
            >
              {ctaLabel}
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/card:translate-x-0.5"
                aria-hidden
              />
            </Button>
          </Link>
        </div>

        {imageUrl ? (
          <div className="relative z-10 flex shrink-0 items-end justify-center px-4 pb-2 sm:w-[140px] sm:px-2 sm:pb-0 lg:w-[180px]">
            <div className="relative size-28 sm:size-32 lg:size-40">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-contain object-bottom drop-shadow-lg transition-transform duration-500 ease-out group-hover/card:-translate-y-1 group-hover/card:scale-105"
                sizes="(max-width: 640px) 112px, 160px"
              />
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
