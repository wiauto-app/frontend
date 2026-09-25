"use client";

import Link from "next/link";
import { CheckCircle2, Eye, LayoutList, Plus, Sparkles } from "lucide-react";
import { motion, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  ListingInsightsPanel,
  type ListingCheckoutStatus,
} from "@/components/vehicles/listing-insights/components/ListingInsightsPanel";
import type { VehicleInsights } from "@/interfaces/vehicle-insights.interface";
import { cn } from "@/lib/utils";
import {
  EASE_ENTER,
  ENTER_TRANSITION,
  getVariant,
} from "@/components/home/motion/motion-variants";
import { usePrefersReducedMotion } from "@/components/home/motion/usePrefersReducedMotion";
import { useEntitlements } from "@/hooks/useEntitlements";

interface PublishSuccessViewProps {
  vehicleId: string;
  displayName: string | null;
  initialInsights: VehicleInsights | null;
  checkoutStatus: ListingCheckoutStatus | null;
}

const pageContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
};

const headerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const textStack: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: ENTER_TRANSITION,
  },
};

const successIconVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", duration: 0.5, bounce: 0.22 },
  },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_ENTER },
  },
};

export const PublishSuccessView = ({
  vehicleId,
  displayName,
  initialInsights,
  checkoutStatus,
}: PublishSuccessViewProps) => {
  const { has } = useEntitlements();
  const showListingInsights = has("listing_insights");
  const prefersReducedMotion = usePrefersReducedMotion();
  const page = getVariant(pageContainer, prefersReducedMotion);
  const header = getVariant(headerContainer, prefersReducedMotion);
  const texts = getVariant(textStack, prefersReducedMotion);
  const item = getVariant(fadeUpItem, prefersReducedMotion);
  const icon = getVariant(successIconVariants, prefersReducedMotion);
  const panel = getVariant(panelVariants, prefersReducedMotion);

  return (
    <motion.div
      className="mx-auto w-full max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={page}
    >
      <motion.header
        className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-center md:justify-between md:gap-8"
        variants={header}
      >
        <motion.div
          className="flex min-w-0 items-center gap-4"
          variants={header}
        >
          <motion.div
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            aria-hidden
            variants={icon}
          >
            <CheckCircle2 className="size-6" />
          </motion.div>
          <motion.div className="min-w-0" variants={texts}>
            <motion.h1
              className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl"
              variants={item}
            >
              ¡Anuncio publicado!
            </motion.h1>
            <motion.p
              className="mt-1 text-sm text-muted-foreground sm:text-base"
              variants={item}
            >
              {displayName ? (
                <>
                  <span className="font-medium text-foreground">
                    {displayName}
                  </span>{" "}
                  ya está visible en WiAuto.
                </>
              ) : (
                "Tu vehículo ya está visible en WiAuto."
              )}
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:items-center md:shrink-0"
          variants={item}
        >
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button
              className="h-10 px-4"
              nativeButton={false}
              render={<Link href={`/vehiculo/${vehicleId}`} />}
            >
              <Eye aria-hidden />
              Ver anuncio
            </Button>
            <Button
              variant="outline"
              className="h-10 px-4"
              nativeButton={false}
              render={<Link href="/usuario/mis-anuncios" />}
            >
              <LayoutList aria-hidden />
              Mis anuncios
            </Button>
          </div>
          <Link
            href="/publicar"
            className="inline-flex items-center gap-1.5 self-start rounded-sm text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:self-auto sm:px-2"
          >
            <Plus className="size-3.5" aria-hidden />
            Publicar otro
          </Link>
        </motion.div>
      </motion.header>

      {showListingInsights ? (
        <>
          <motion.section
            aria-labelledby="wiauto-ai-analysis-heading"
            className="relative mt-8 overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 px-4 py-5 sm:px-6 sm:py-6"
            variants={panel}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 right-0 size-48 rounded-full bg-primary/10 blur-3xl"
            />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1.5">
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                  Impulsado por WiAuto AI
                </p>
                <h2
                  id="wiauto-ai-analysis-heading"
                  className="text-lg font-semibold tracking-tight text-balance text-foreground sm:text-xl"
                >
                  Hemos analizado tu anuncio por ti
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Nuestra IA revisa fotos, precio y descripción para detectar
                  qué frena la venta y proponerte un plan claro de mejoras.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.div className="pt-6" variants={panel}>
            <ListingInsightsPanel
              vehicleId={vehicleId}
              initialInsights={initialInsights}
              checkoutStatus={checkoutStatus}
            />
          </motion.div>
        </>
      ) : null}
    </motion.div>
  );
};

const fallbackContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

export const PublishSuccessFallback = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const container = getVariant(fallbackContainer, prefersReducedMotion);
  const item = getVariant(fadeUpItem, prefersReducedMotion);
  const icon = getVariant(successIconVariants, prefersReducedMotion);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        className={cn(
          "w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10",
        )}
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.div
          className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          aria-hidden
          variants={icon}
        >
          <CheckCircle2 className="size-8" />
        </motion.div>
        <motion.h1
          className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          variants={item}
        >
          ¡Anuncio publicado!
        </motion.h1>
        <motion.p
          className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
          variants={item}
        >
          Tu vehículo ya está en WiAuto. Gestiona todos tus anuncios desde tu
          panel.
        </motion.p>
        <motion.div variants={item}>
          <Button
            size="lg"
            className="h-11 w-full text-base font-semibold"
            nativeButton={false}
            render={<Link href="/usuario/mis-anuncios" />}
          >
            <LayoutList className="size-4" aria-hidden />
            Ir a mis anuncios
          </Button>
        </motion.div>
        <motion.p className="mt-6 text-sm" variants={item}>
          <Link
            href="/publicar"
            className="inline-flex items-center gap-1.5 rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="size-3.5" aria-hidden />
            Publicar otro vehículo
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};
