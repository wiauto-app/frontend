"use client";

import Image from "next/image";

import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";
import { HeroFeatures } from "@/components/home/heroFeatures";
import { HeroActions } from "@/components/ui/heroActions";
import { HeroCard } from "@/components/ui/heroCard";
import {
  isStrapiActionKey,
  STRAPI_ACTION_KEYS,
} from "@/components/strapi-actions/strapi-action-keys";
import { StrapiHero } from "@/interfaces/strapi-components.interface";
import { collabsIconPack } from "@/app/(landing)/colaboraciones/components/collabsIconPack";

import {
  COLLABS_SEGUROS_HERO_FORM_ID,
  CollabsSegurosHeroForm,
} from "./collabsSegurosHeroForm";

interface HeroSectionProps {
  hero?: StrapiHero;
  actionKey?: string | null;
  className?: string;
}

interface PartnerCardHorizontalProps {
  card: NonNullable<StrapiHero["card"]>;
}

const PartnerCardHorizontal = ({ card }: PartnerCardHorizontalProps) => {
  if (!card.imagen?.url && !card.titulo && !card.descripcion) {
    return null;
  }

  return (
    <div className="mt-2 flex w-full max-w-lg items-center gap-4 rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
      {card.imagen?.url ? (
        <Image
          src={card.imagen.url}
          alt={card.imagen.alternativeText ?? ""}
          width={96}
          height={48}
          className="h-12 w-auto shrink-0 object-contain"
        />
      ) : null}
      {(card.titulo || card.descripcion) && card.imagen?.url ? (
        <div className="h-10 w-px shrink-0 bg-slate-200" aria-hidden />
      ) : null}
      <div className="min-w-0">
        {card.titulo ? (
          <p className="font-semibold text-[#0061F2]">{card.titulo}</p>
        ) : null}
        {card.descripcion ? (
          <p className="text-sm text-slate-600">{card.descripcion}</p>
        ) : null}
      </div>
    </div>
  );
};

export const CollabsHeroSection = ({
  hero,
  actionKey,
  className,
}: HeroSectionProps) => {
  if (!hero) {
    return null;
  }

  const backgroundUrl = hero.imagen?.url;
  const isEmbeddedSegurosForm =
    isStrapiActionKey(actionKey) &&
    actionKey === STRAPI_ACTION_KEYS.SEGUROS_FORM;

  const formTitle = hero.acciones?.[0]?.label || "Calcular seguro";

  if (isEmbeddedSegurosForm) {
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

            <HeroFeatures
              features={hero.caracteristicas}
              iconPack={collabsIconPack}
            />

            {hero.card ? <PartnerCardHorizontal card={hero.card} /> : null}
          </>
        }
        floatingContent={<HeroBackdrop />}
        rightContent={
          <div className="flex w-full justify-center lg:justify-end">
            <CollabsSegurosHeroForm
              formId={COLLABS_SEGUROS_HERO_FORM_ID}
              title={formTitle}
              logo={hero.card?.imagen}
            />
          </div>
        }
      />
    );
  }

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
          <HeroFeatures
            features={hero.caracteristicas}
            iconPack={collabsIconPack}
          />
          <HeroActions actions={hero.acciones} />
        </>
      }
      floatingContent={<HeroBackdrop />}
      rightContent={
        <div className="flex w-full justify-center">
          {hero.card ? <HeroCard card={hero.card} /> : null}
        </div>
      }
    />
  );
};
