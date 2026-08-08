import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { BRAND_BLUE } from "./data/home-data";
import type { StrapiCard } from "@/interfaces/strapi-components.interface";

const DEFAULT_BACKGROUND = BRAND_BLUE;

const pickImageUrl = (item: StrapiCard): string | null => {
  const media = item.imagen;
  if (!media) {
    return null;
  }

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
  const title = item.titulo?.trim() || "";
  const imageAlt = item.imagen?.alternativeText?.trim() || title;
  const ctaLabel = item.boton?.label?.trim() || "Ver más";
  const ctaUrl = item.boton?.url?.trim() || "#";
  const ctaAriaLabel = `${ctaLabel}: ${title}`;

  return (
    <Card
      size="sm"
      style={{ backgroundColor }}
    >
      <CardContent className="flex  justify-between">
       
        <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 ">
          <div className="space-y-1">
            <h3 className="font-bold leading-tight text-xl lg:text-2xl" style={{ color: item.colorTexto ?? undefined }}>
              {title}
            </h3>
            {item.descripcion ? (
              <p className="max-w-md text-sm leading-relaxed  sm:text-base" style={{ color: item.colorTexto ?? undefined }}>
                {item.descripcion}
              </p>
            ) : null}
          </div>
          <Link href={ctaUrl} aria-label={ctaAriaLabel} className="w-full md:w-fit">
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "w-full md:w-fit border-white/20 bg-white text-slate-900",
                "hover:bg-white/90 focus-visible:ring-white/40",
                "group-hover/card:shadow-md",
              )}
            >
              {ctaLabel}
              <ArrowRight
                className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </Button>
          </Link>
        </div>

        {imageUrl ? (
          <div className="hidden relative z-10 lg:flex shrink-0 items-end justify-center px-4 pb-2 sm:w-[140px] sm:px-2 sm:pb-0 lg:w-[180px]">
            <div className="relative size-28 sm:size-32 lg:size-40">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="home-card-image object-contain object-bottom drop-shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
                sizes="(max-width: 640px) 112px, 160px"
              />
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
