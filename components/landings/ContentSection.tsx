"use client";

import Link from "next/link";
import { useId } from "react";

import { buttonVariants } from "@/components/ui/button";
import { IconContainer } from "@/components/ui/iconContainer";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";
import { StrapiHero } from "@/interfaces/strapi-components.interface";
import { HeroActions } from "../ui/heroActions";

export type ContentSectionVariant = "split" | "band";

interface ContentSectionProps {
  content?: StrapiHero;
  /** `split`: editorial texto + imagen. `band`: banda de marca con media arriba. */
  variant?: ContentSectionVariant;
  className?: string;
}

interface ContentActionsProps {
  actions: NonNullable<StrapiHero["acciones"]>;
  className?: string;
}

interface ContentFeaturesProps {
  features: NonNullable<StrapiHero["caracteristicas"]>;
  layout?: "list" | "grid";
}

interface ContentVariantProps {
  content: StrapiHero;
  titleId: string;
}


const ContentFeatures = ({
  features,
  layout = "list",
}: ContentFeaturesProps) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        layout === "grid"
          ? "grid gap-4 sm:grid-cols-2"
          : "flex flex-col gap-4",
      )}
    >
      {features.map((feature) => (
        <li key={feature.id} className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconContainer
              Icon={resolveStrapiIconName(
                feature.iconName,
                defaultStrapiIconPack,
              )}
              justIcon
              size="xs"
            />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-sm font-semibold text-slate-900">
              {feature.label}
            </p>
            {feature.descripcion ? (
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {feature.descripcion}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};

const SplitContent = ({ content, titleId }: ContentVariantProps) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-gray-50 px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-5" aria-labelledby={titleId}>
          {content.titulo ? (
            <h2
              id={titleId}
              className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
            >
              {content.titulo}
            </h2>
          ) : null}

          {content.descripcion ? (
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {content.descripcion}
            </p>
          ) : null}

          {content.caracteristicas && content.caracteristicas.length > 0 ? (
            <ContentFeatures features={content.caracteristicas} layout="list" />
          ) : null}

          {content.acciones && content.acciones.length > 0 ? (
            <HeroActions actions={content.acciones} />
          ) : null}
        </div>

        {content.imagen?.url ? (
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-200 lg:aspect-auto lg:min-h-88">
            <img
              src={content.imagen.url}
              alt={content.imagen.alternativeText || content.titulo || ""}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const BandContent = ({ content, titleId }: ContentVariantProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/10 bg-primary/6">
      {content.imagen?.url ? (
        <div className="relative aspect-21/9 max-h-72 w-full overflow-hidden sm:max-h-80">
          <img
            src={content.imagen.url}
            alt={content.imagen.alternativeText || content.titulo || ""}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-slate-950/35 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      ) : null}

      <div
        className="flex flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10 lg:py-10"
        aria-labelledby={titleId}
      >
        <div className="max-w-3xl">
          {content.titulo ? (
            <h2
              id={titleId}
              className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
            >
              {content.titulo}
            </h2>
          ) : null}

          {content.descripcion ? (
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
              {content.descripcion}
            </p>
          ) : null}
        </div>

        {content.caracteristicas && content.caracteristicas.length > 0 ? (
          <ContentFeatures features={content.caracteristicas} layout="grid" />
        ) : null}

        {content.acciones && content.acciones.length > 0 ? (
          <HeroActions actions={content.acciones} />
        ) : null}
      </div>
    </div>
  );
};

/**
 * Bloque de contenido post-hero. No reutiliza el layout del Hero:
 * tipografía oscura, fondos claros y media contenida.
 */
export const ContentSection = ({
  content,
  variant = "split",
  className,
}: ContentSectionProps) => {
  const titleId = useId();

  if (!content) {
    return null;
  }

  return (
    <section className={className}>
      {variant === "band" ? (
        <BandContent content={content} titleId={titleId} />
      ) : (
        <SplitContent content={content} titleId={titleId} />
      )}
    </section>
  );
};
