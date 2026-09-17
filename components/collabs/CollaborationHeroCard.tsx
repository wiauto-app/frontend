import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { IconContainer } from "@/components/ui/iconContainer";
import type {
  StrapiHero,
  StrapiIconFeature,
} from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";

export interface CollaborationHeroCardProps {
  content: StrapiHero;
  className?: string;
}

interface CollaborationFeatureProps {
  feature: StrapiIconFeature;
}

const CollaborationFeature = ({ feature }: CollaborationFeatureProps) => {
  return (
    <li className="flex min-w-0 items-start gap-3 py-2.5">
      <IconContainer
        Icon={
          resolveStrapiIconName(feature.iconName, defaultStrapiIconPack) ??
          Check
        }
        size="xs"
        className="size-7 rounded-md bg-primary/8 [&_svg]:size-3.5"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium leading-5 text-slate-900">
          {feature.label}
        </p>
        {feature.descripcion ? (
          <p className="mt-0.5 text-xs leading-5 text-slate-500">
            {feature.descripcion}
          </p>
        ) : null}
      </div>
    </li>
  );
};

export const CollaborationHeroCard = ({
  content,
  className,
}: CollaborationHeroCardProps) => {
  const imageUrl = content.imagen?.url ?? content.card?.imagen?.url;
  const imageAlt =
    content.imagen?.alternativeText?.trim() ||
    content.card?.imagen?.alternativeText?.trim() ||
    content.titulo ||
    "";
  const action = content.acciones?.[0] ?? content.card?.boton ?? null;
  const hasFeatures = (content.caracteristicas?.length ?? 0) > 0;
  const isExternal = action?.externo === true;

  if (!action) {
    return null;
  }

  return (
    <Link
      href={action.url}
      aria-label={action.label || content.titulo}
      className={cn("block", className)}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className={cn("flex items-center justify-between gap-4",)}>
        <div className="flex min-w-0 flex-1 flex-col ">
          <div className="flex items-center gap-4">
            <div className="relative min-w-20 h-10 md:min-w-32 md:h-16">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 112px"
                  className="object-contain"
                />
              ) : null}
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="text-base lg:text-lg font-semibold">{content.titulo}</h2>
              {content.descripcion ? (
                <p className="whitespace-pre-line text-xs text-muted-foreground">
                  {content.descripcion}
                </p>
              ) : null}
            </div>
          </div>

          {hasFeatures ? (
            <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-200 pt-1 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:divide-y-0">
              {content.caracteristicas.map((feature) => (
                <CollaborationFeature key={feature.id} feature={feature} />
              ))}
            </ul>
          ) : null}
        </div>

        <ChevronRight
          className="size-5 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden
        />
      </div>
    </Link>
  );
};
