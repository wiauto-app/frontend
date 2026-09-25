"use client";

import { useId } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CircleAlert,
  Info,
  OctagonAlert,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  CheckSeverity,
  ListingCheck,
  ListingHealth,
  VehicleInsights,
} from "@/interfaces/vehicle-insights.interface";
import {
  HEALTH_TIER_CHIP_CLASS,
  HEALTH_TIER_LABEL,
} from "../utils/listing-insights-format";
import {
  ListingDiagnosisChecklist,
  type ResolveCheckHref,
} from "./ListingDiagnosisChecklist";
import { ListingScoreRing } from "./ListingScoreRing";
import { PriceInsightCard } from "./PriceInsightCard";
import { FunnelComparison } from "./FunnelComparison";
import { FeaturedOffersSection } from "./FeaturedOffersSection";

/**
 * `sheet`: columna única y compacta (panel lateral de Mis anuncios).
 * `page`: diagnóstico en página, con columna lateral en escritorio.
 */
export type ListingDiagnosisVariant = "sheet" | "page";

/** Entrada escalonada; `globals.css` la anula con prefers-reduced-motion. */
const ENTER_CLASS =
  "animate-[fade-up_0.6s_cubic-bezier(0.23,1,0.32,1)_both] motion-reduce:animate-none";

/** Columnas del layout de página (diagnóstico + lateral). */
export const DIAGNOSIS_PAGE_GRID_CLASS =
  "grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-8";

interface SeverityVisual {
  icon: LucideIcon;
  label: string;
  iconClass: string;
  textClass: string;
}

const SEVERITY_VISUAL: Record<CheckSeverity, SeverityVisual> = {
  critical: {
    icon: OctagonAlert,
    label: "Prioridad crítica",
    iconClass: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    textClass: "text-red-700 dark:text-red-300",
  },
  high: {
    icon: AlertTriangle,
    label: "Prioridad alta",
    iconClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    textClass: "text-orange-700 dark:text-orange-300",
  },
  medium: {
    icon: CircleAlert,
    label: "Prioridad media",
    iconClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    textClass: "text-amber-800 dark:text-amber-300",
  },
  low: {
    icon: Info,
    label: "Prioridad baja",
    iconClass: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    textClass: "text-sky-700 dark:text-sky-300",
  },
};

const FALLBACK_SEVERITY_VISUAL: Omit<SeverityVisual, "label"> = {
  icon: CircleAlert,
  iconClass: "bg-muted text-muted-foreground",
  textClass: "text-muted-foreground",
};

const buildHeadline = (issuesCount: number): string => {
  if (issuesCount === 0) {
    return "Tu anuncio cumple todas las recomendaciones";
  }
  return issuesCount === 1
    ? "Tu anuncio tiene 1 mejora pendiente"
    : `Tu anuncio tiene ${issuesCount} mejoras pendientes`;
};

/* -------------------------------------------------------------------------- */
/* Resumen + acciones + checklist                                              */
/* -------------------------------------------------------------------------- */

interface DiagnosisOverviewProps {
  health: ListingHealth;
  variant: ListingDiagnosisVariant;
  resolveHref: ResolveCheckHref;
  onNavigate?: () => void;
}

const DiagnosisOverview = ({
  health,
  variant,
  resolveHref,
  onNavigate,
}: DiagnosisOverviewProps) => {
  const checklistId = useId();
  const actions = health.actions.slice(0, 3);
  const totalChecks = health.checks.length;
  const passedChecks = health.checks.filter(
    (check) => check.status === "pass",
  ).length;
  const isPage = variant === "page";
  const inset = isPage ? "px-4 sm:px-6" : "px-4";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground">
      <div className={cn("flex items-center gap-4 py-5", inset)}>
        <ListingScoreRing
          score={health.score}
          tier={health.tier}
          size={isPage ? "md" : "sm"}
          showLabel={false}
        />
        <div className="min-w-0 space-y-1.5">
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
              HEALTH_TIER_CHIP_CLASS[health.tier],
            )}
          >
            {HEALTH_TIER_LABEL[health.tier]}
          </span>
          <p
            className={cn(
              "font-semibold text-balance text-foreground",
              isPage ? "text-lg leading-snug sm:text-xl" : "text-base leading-snug",
            )}
          >
            {buildHeadline(health.issues_count)}
          </p>
          {health.issues_count > 0 ? (
            <p className="text-sm text-muted-foreground">
              Empieza por las que más te ayudarán a vender.
            </p>
          ) : null}
        </div>
      </div>

      {actions.length > 0 ? (
        <div className="border-t border-border">
          <h3
            className={cn(
              "pt-4 text-sm font-semibold text-foreground",
              inset,
            )}
          >
            Mejoras prioritarias
          </h3>
          <ol className="divide-y divide-border">
            {actions.map((action, index) => (
              <DiagnosisActionRow
                key={action.code}
                action={action}
                href={resolveHref(action)}
                isPrimary={index === 0}
                variant={variant}
                inset={inset}
                onNavigate={onNavigate}
              />
            ))}
          </ol>
        </div>
      ) : null}

      {totalChecks > 0 ? (
        <div className="border-t border-border">
          <div
            className={cn(
              "flex items-center justify-between gap-3 py-3.5 text-sm font-medium text-foreground",
              inset,
            )}
          >
            <h3 id={checklistId}>Todos los puntos</h3>
            <span className="text-xs font-normal tabular-nums text-muted-foreground">
              {passedChecks} de {totalChecks} correctos
            </span>
          </div>
          <div
            aria-labelledby={checklistId}
            className={cn("border-t border-border", inset)}
          >
            <ListingDiagnosisChecklist
              checks={health.checks}
              resolveHref={resolveHref}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface DiagnosisActionRowProps {
  action: ListingCheck;
  href: string | null;
  isPrimary: boolean;
  variant: ListingDiagnosisVariant;
  inset: string;
  onNavigate?: () => void;
}

const DiagnosisActionRow = ({
  action,
  href,
  isPrimary,
  variant,
  inset,
  onNavigate,
}: DiagnosisActionRowProps) => {
  const visual = action.severity
    ? SEVERITY_VISUAL[action.severity]
    : { ...FALLBACK_SEVERITY_VISUAL, label: null };
  const Icon = visual.icon;

  return (
    <li className={cn("flex gap-3 py-4", inset)}>
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
          visual.iconClass,
        )}
        aria-hidden
      >
        <Icon className="size-4" />
      </span>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-3",
          variant === "page" && "sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        )}
      >
        <div className="min-w-0 space-y-1">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-sm font-semibold text-foreground">
              {action.title}
            </span>
            {visual.label ? (
              <span className={cn("text-xs font-medium", visual.textClass)}>
                {visual.label}
              </span>
            ) : null}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {action.description}
          </p>
        </div>
        {href && action.cta ? (
          <Button
            size="sm"
            variant={isPrimary ? "default" : "outline"}
            className="shrink-0 self-start sm:self-auto"
            nativeButton={false}
            render={<Link href={href} onClick={onNavigate} />}
          >
            {action.cta.label}
            <ArrowRight data-icon="inline-end" aria-hidden />
          </Button>
        ) : null}
      </div>
    </li>
  );
};

/* -------------------------------------------------------------------------- */
/* Contenido completo                                                          */
/* -------------------------------------------------------------------------- */

interface ListingDiagnosisContentProps {
  insights: VehicleInsights;
  variant: ListingDiagnosisVariant;
  resolveHref: ResolveCheckHref;
  /** Destino del CTA "Ajustar precio" del banner de destacado. */
  adjustPriceHref: string;
  onNavigate?: () => void;
  /** Rutas de retorno de Stripe para el destacado de pago. */
  successPath?: string;
  cancelPath?: string;
}

export const ListingDiagnosisContent = ({
  insights,
  variant,
  resolveHref,
  adjustPriceHref,
  onNavigate,
  successPath,
  cancelPath,
}: ListingDiagnosisContentProps) => {
  const titleId = useId();

  const overview = (
    <DiagnosisOverview
      health={insights.health}
      variant={variant}
      resolveHref={resolveHref}
      onNavigate={onNavigate}
    />
  );
  // const priceCard = (
  //   <PriceInsightCard vehicleId={insights.vehicle_id} price={insights.price} />
  // );
  const funnel = <FunnelComparison funnel={insights.funnel} />;
  const offers = (
    <FeaturedOffersSection
      vehicleId={insights.vehicle_id}
      featured={insights.featured}
      adjustPriceHref={adjustPriceHref}
      onNavigate={onNavigate}
      successPath={successPath}
      cancelPath={cancelPath}
    />
  );

  if (variant === "sheet") {
    return (
      <div className="space-y-4">
        {overview}
        {/* {priceCard} */}
        {funnel}
        {offers}
      </div>
    );
  }

  return (
    <div className={DIAGNOSIS_PAGE_GRID_CLASS}>
      <section
        aria-labelledby={titleId}
        className={cn(ENTER_CLASS, "[animation-delay:80ms]")}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2
            id={titleId}
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Diagnóstico de tu anuncio
          </h2>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            Analizado con WiAuto AI
          </span>
        </div>
        {overview}
      </section>

      <div
        className={cn(
          ENTER_CLASS,
          "space-y-6 [animation-delay:160ms] lg:pt-10",
        )}
      >
        {/* {priceCard} */}
        {funnel}
        {offers}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

const OverviewSkeleton = ({ variant }: { variant: ListingDiagnosisVariant }) => {
  const inset = variant === "page" ? "px-4 sm:px-6" : "px-4";
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className={cn("flex items-center gap-4 py-5", inset)}>
        <Skeleton
          className={cn(
            "shrink-0 rounded-full",
            variant === "page" ? "size-20" : "size-14",
          )}
        />
        <div className="w-full space-y-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="divide-y divide-border border-t border-border">
        {[0, 1, 2].map((row) => (
          <div key={row} className={cn("flex gap-3 py-4", inset)}>
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
        <div className={cn("py-4", inset)}>
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
};

export const ListingDiagnosisSkeleton = ({
  variant,
}: {
  variant: ListingDiagnosisVariant;
}) => {
  if (variant === "sheet") {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">Cargando diagnóstico del anuncio…</span>
        <OverviewSkeleton variant="sheet" />
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className={DIAGNOSIS_PAGE_GRID_CLASS}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Cargando el diagnóstico de tu anuncio…</span>
      <div>
        <Skeleton className="mb-3 h-7 w-56" />
        <OverviewSkeleton variant="page" />
      </div>
      <div className="space-y-6 lg:pt-10">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    </div>
  );
};
