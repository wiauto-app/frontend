import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { BRAND_BLUE, CONFIDENZA_WEBSITE } from "../constants";
import type { SegurosHero } from "../interfaces/seguros.interface";

interface SegurosSecuritySectionProps {
  hero: SegurosHero | null;
}

export const SegurosSecuritySection = ({
  hero,
}: SegurosSecuritySectionProps) => {
  if (!hero) {
    return null;
  }

  const image_url =
    getStrapiMediaUrl(hero.imagen?.formats?.large?.url) ??
    getStrapiMediaUrl(hero.imagen?.formats?.medium?.url) ??
    getStrapiMediaUrl(hero.imagen?.url);

  const points =
    hero.caracteristicas?.filter((item) => item.label?.trim()) ?? [];

  const primary_action = hero.acciones?.[0] ?? null;
  const action_href = primary_action?.url?.trim() || CONFIDENZA_WEBSITE;
  const action_label =
    primary_action?.label?.trim() || "Conoce más en su sitio web";

  const quote = hero.card?.descripcion?.trim() || null;
  const quote_author = hero.card?.titulo?.trim() || null;

  return (
    <section className="bg-muted-foreground/10 rounded-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-8 items-center">
        <div className=" p-4 lg:p-8 md:col-span-1">
          {hero.titulo ? (
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-2xl">
              {hero.titulo}
            </h2>
          ) : null}
          {hero.descripcion ? (
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {hero.descripcion}
            </p>
          ) : null}

          {points.length > 0 ? (
            <div className="mt-8 space-y-1">
              {points.map((point) => (
                <div key={point.id} className="flex items-center gap-3">
                  <CheckCircle2
                    className="size-5 shrink-0"
                    style={{ color: BRAND_BLUE }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <Button
            className="mt-8 rounded-md inline-flex items-center text-sm font-semibold"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            <Link href={action_href} className="p-4 flex flex-row gap-2">
              {action_label}
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="md:col-span-2 relative   h-full">
          {image_url ? (
            <div className="aspect-4/2 lg:aspect-auto rounded-2xl overflow-hidden h-full relative">
              <Image
                src={image_url}
                alt={hero.imagen?.alternativeText ?? hero.titulo ?? "Seguridad"}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          ) : null}
          {quote ? (
            <div className="hidden md:flex absolute flex-col items-start gap-3 top-1/2 -translate-y-1/2 right-16 bg-slate-900 text-white p-6 rounded-xl w-64">
              <ExternalLink className="size-4" />
              <p className="font-semibold text-left text-sm leading-snug">
                {quote}
              </p>
              <div className="w-full h-1 rounded-full bg-white/20">
                <div className="w-1/5 h-full rounded-full bg-white" />
              </div>
              {quote_author ? (
                <p className="text-xs opacity-90 text-left">{quote_author}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
