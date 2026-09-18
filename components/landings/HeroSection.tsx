'use client';

import Link from "next/link";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";
import { IconContainer } from "@/components/ui/iconContainer";

import type { Hero as HeroType } from "@/interfaces/landings-colaboracion.interface";

interface HeroSectionProps {
  hero?: HeroType;
  className?: string;
}

export const HeroSection = ({ hero, className }: HeroSectionProps) => {
  if (!hero) {
    return null;
  }

  const backgroundUrl = hero.imagen?.url;

  return (
    <Hero
      className={`lg:h-auto ${className ?? ""}`}
      image={backgroundUrl ?? undefined}
      leftContent={
        <>
          {hero.titulo ? <HeroTitle>{hero.titulo}</HeroTitle> : null}

          {hero.descripcion ? (
            <HeroDescription>{hero.descripcion}</HeroDescription>
          ) : null}

          {hero.caracteristicas && hero.caracteristicas.length > 0 ? (
            <ul className="hidden lg:flex gap-3 sm:gap-x-6 sm:gap-y-3 flex-col">
              {hero.caracteristicas.map((feature) => (
                <li
                  key={feature.id}
                  className="flex items-center gap-1 lg:gap-2"
                >
                  <IconContainer
                    Icon={resolveStrapiIconName(
                      feature.iconName,
                      defaultStrapiIconPack,
                    )}
                    justIcon
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-white">{feature.label}</p>
                    {feature.descripcion ? (
                      <p className="mt-0.5 text-xs text-white/75">
                        {feature.descripcion}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {hero.acciones && hero.acciones.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center gap-3">
              {hero.acciones.map((action) => (
                <Link
                  key={action.id}
                  href={action.href ?? "#"}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors w-full lg:w-auto text-center ${
                    action.tipo === "primary"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : action.tipo === "secondary"
                        ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                        : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </>
      }
      floatingContent={<HeroBackdrop />}
    />
  );
};
