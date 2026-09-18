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

interface ContentSectionProps {
  content?: HeroType;
  className?: string;
}

/**
 * Generic content section — similar to HeroSection but positioned
 * after hero for secondary content blocks.
 */
export const ContentSection = ({ content, className }: ContentSectionProps) => {
  if (!content) {
    return null;
  }

  const backgroundUrl = content.imagen?.url;

  return (
    <section className={className}>
      <Hero
        className="lg:h-auto"
        image={backgroundUrl ?? undefined}
        leftContent={
          <>
            {content.titulo ? <HeroTitle>{content.titulo}</HeroTitle> : null}

            {content.descripcion ? (
              <HeroDescription>{content.descripcion}</HeroDescription>
            ) : null}

            {content.caracteristicas && content.caracteristicas.length > 0 ? (
              <ul className="hidden lg:flex gap-3 sm:gap-x-6 sm:gap-y-3 flex-col">
                {content.caracteristicas.map((feature) => (
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

            {content.acciones && content.acciones.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-3">
                {content.acciones.map((action) => (
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
    </section>
  );
};
