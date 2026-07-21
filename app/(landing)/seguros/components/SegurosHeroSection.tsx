import Link from "next/link";
import { ExternalLink, Shield, Star } from "lucide-react";

import { HeroFeatures } from "@/components/home/heroFeatures";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";
import type { HeroFeature } from "@/interfaces/hero-feature.interface";
import type { StrapiIconFeature } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";

import {
  BRAND_BLUE,
  CONFIDENZA_RATING,
  CONFIDENZA_REVIEWS,
  CONFIDENZA_WEBSITE,
} from "../constants";
import type { SegurosHero } from "../interfaces/seguros.interface";

interface SegurosHeroSectionProps {
  hero: SegurosHero | null;
}

const mapIconFeaturesToHeroFeatures = (
  items: StrapiIconFeature[] | null | undefined,
): HeroFeature[] => {
  if (!items?.length) {
    return [];
  }

  return items
    .filter((item) => item.label?.trim())
    .map((item) => {
      const label = item.label.trim();

      return {
        id: String(item.id),
        label,
        description: item.descripcion?.trim() ?? null,
        icon_url:
          getStrapiMediaUrl(item.icon?.formats?.small?.url) ??
          getStrapiMediaUrl(item.icon?.url),
        icon_alt: item.icon?.alternativeText ?? label,
      };
    });
};

export const SegurosHeroSection = ({ hero }: SegurosHeroSectionProps) => {
  if (!hero) {
    return null;
  }

  const background_url =
    getStrapiMediaUrl(hero.imagen?.formats?.large?.url) ??
    getStrapiMediaUrl(hero.imagen?.formats?.medium?.url) ??
    getStrapiMediaUrl(hero.imagen?.url);

  const primary_action = hero.acciones?.[0] ?? null;
  const action_href = primary_action?.url?.trim() || CONFIDENZA_WEBSITE;
  const action_label =
    primary_action?.label?.trim() || "Conoce más en su sitio web";

  const card = hero.card;
  const CardIcon = resolveStrapiIconName(card?.iconName);
  const features = mapIconFeaturesToHeroFeatures(hero.caracteristicas);

  return (
    <Hero
      image={background_url ?? undefined}
      leftContent={
        <div className="flex flex-col justify-center space-y-5 px-4 text-white lg:px-14">
          <span className="inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
            Compañía aliada
          </span>

          {hero.titulo ? <HeroTitle>{hero.titulo}</HeroTitle> : null}

          {hero.descripcion ? (
            <HeroDescription>{hero.descripcion}</HeroDescription>
          ) : null}

          <HeroFeatures features={features} />

          <Button className="mt-2 w-fit px-8 py-4 rounded-md text-slate-900 inline-flex items-center gap-1.5 text-sm font-semibold bg-white hover:bg-blue-50">
            <Link href={action_href} className="flex flex-row gap-1.5">
              {action_label}
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        </div>
      }
      rightContent={
        <div className="flex justify-center items-center">
          <Card className="mx-auto w-fit rounded-2xl border-0 shadow-2xl lg:mx-0 lg:max-w-none">
            <CardContent className="flex flex-col items-center p-6 text-center sm:p-8">
              <div
                className="flex size-16 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                {CardIcon
                  ? CardIcon({ className: "size-8" })
                  : <Shield className="size-8" />}
              </div>

              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
                {card?.titulo ?? hero.titulo ?? "Seguros"}
              </h2>
              {card?.descripcion ? (
                <p className="mt-1 text-sm text-slate-500">{card.descripcion}</p>
              ) : null}

              <div className="mt-5 flex items-center gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {CONFIDENZA_RATING}
                </span>
                <div className="text-left">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 fill-[#FFB800] text-[#FFB800]"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    ({CONFIDENZA_REVIEWS.toLocaleString("es-ES")} opiniones)
                  </p>
                </div>
              </div>

              <span className="mt-5 inline-flex rounded-full px-4 py-1.5 text-md font-bold text-slate-500">
                Aliado oficial de WiAuto
              </span>
            </CardContent>
          </Card>
        </div>
      }
      floatingContent={<HeroBackdrop />}
    />
  );
};
