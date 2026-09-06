import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import { IconContainer } from "@/components/ui/iconContainer";
import { StrapiRenderer } from "@/components/ui/strapiRenderer";
import type {
  StrapiHero,
  StrapiIconFeature,
  StrapiLink,
} from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";

export interface CollaborationHeroCardProps {
  content: StrapiHero;
  className?: string;
}

const CollaborationFeature = ({
  feature,
}: {
  feature: StrapiIconFeature;
}) => {
  return (
    <li className="flex min-w-0 items-start gap-3 py-2.5">
      <IconContainer
        Icon={resolveStrapiIconName(feature.iconName) ?? Check}
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

const CollaborationAction = ({
  action,
  primary,
}: {
  action: StrapiLink;
  primary: boolean;
}) => {
  const isExternal = action.externo === true;

  return (
    <Link
      href={action.url}
      className={cn(
        "group/action inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        primary
          ? "bg-primary text-white hover:bg-primary-dark"
          : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
      )}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span>{action.label}</span>
      <ArrowRight
        className="size-4 transition-transform duration-200 group-hover/action:translate-x-0.5"
        aria-hidden
      />
    </Link>
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
  const actions = content.acciones?.length
    ? content.acciones
    : content.card?.boton
      ? [content.card.boton]
      : [];
  const hasFeatures = (content.caracteristicas?.length ?? 0) > 0;
  const hasFooter = Boolean(content.footer?.length);

  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white",
        "shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_-20px_rgba(15,23,42,0.25)]",
        className,
      )}
    >
      <div className="h-1 w-full bg-primary" aria-hidden />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Servicio colaborador
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold leading-7 tracking-tight text-slate-950">
              {content.titulo}
            </h2>
            {content.descripcion ? (
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                {content.descripcion}
              </p>
            ) : null}
          </div>

          {imageUrl ? (
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-28">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="112px"
                className="object-contain p-2.5"
              />
            </div>
          ) : null}
        </div>

        {hasFeatures ? (
          <ul className="mt-5 divide-y divide-slate-100 border-t border-slate-200 pt-1 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:divide-y-0">
            {content.caracteristicas.map((feature) => (
              <CollaborationFeature key={feature.id} feature={feature} />
            ))}
          </ul>
        ) : null}

        {actions.length > 0 ? (
          <div className="mt-auto pt-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              {actions.map((action, index) => (
                <CollaborationAction
                  key={action.id}
                  action={action}
                  primary={index === 0}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {hasFooter ? (
        <footer className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
          <StrapiRenderer
            content={content.footer ?? []}
            className="text-xs leading-relaxed text-slate-500 [&_p]:text-slate-500"
          />
        </footer>
      ) : null}
    </article>
  );
};
