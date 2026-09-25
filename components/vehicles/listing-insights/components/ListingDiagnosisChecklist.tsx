import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  CheckStatus,
  ListingCheck,
} from "@/interfaces/vehicle-insights.interface";
import { buildEditHref } from "../utils/buildEditHref";

export type ResolveCheckHref = (check: ListingCheck) => string | null;

interface CheckStatusVisual {
  icon: LucideIcon;
  className: string;
  label: string;
}

const CHECK_STATUS_VISUAL: Record<CheckStatus, CheckStatusVisual> = {
  pass: {
    icon: CheckCircle2,
    className: "text-emerald-600 dark:text-emerald-400",
    label: "Correcto",
  },
  warn: {
    icon: AlertTriangle,
    className: "text-amber-600 dark:text-amber-400",
    label: "Mejorable",
  },
  fail: {
    icon: XCircle,
    className: "text-red-600 dark:text-red-400",
    label: "Pendiente",
  },
  unknown: {
    icon: CircleHelp,
    className: "text-muted-foreground",
    label: "Sin datos",
  },
};

export const buildDefaultCheckHref =
  (vehicleId: string): ResolveCheckHref =>
  (check) =>
    check.cta ? buildEditHref(vehicleId, check.cta.target) : null;

interface ListingCheckItemProps {
  check: ListingCheck;
  resolveHref: ResolveCheckHref;
  onNavigate?: () => void;
}

export const ListingCheckItem = ({
  check,
  resolveHref,
  onNavigate,
}: ListingCheckItemProps) => {
  const visual = CHECK_STATUS_VISUAL[check.status];
  const Icon = visual.icon;
  const href = check.status === "pass" ? null : resolveHref(check);

  return (
    <li className="flex items-start gap-3 py-3">
      <Icon
        className={cn("mt-0.5 size-4 shrink-0", visual.className)}
        aria-hidden
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium text-foreground">
          <span className="sr-only">{visual.label}: </span>
          {check.title}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {check.description}
        </p>
      </div>
      {href && check.cta ? (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-primary"
          nativeButton={false}
          render={<Link href={href} onClick={onNavigate} />}
        >
          {check.cta.label}
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
      ) : null}
    </li>
  );
};

interface ListingDiagnosisChecklistProps {
  checks: ListingCheck[];
  resolveHref: ResolveCheckHref;
  onNavigate?: () => void;
  id?: string;
}

export const ListingDiagnosisChecklist = ({
  checks,
  resolveHref,
  onNavigate,
  id,
}: ListingDiagnosisChecklistProps) => {
  return (
    <ul id={id} className="divide-y divide-border" aria-label="Checklist del anuncio">
      {checks.map((check) => (
        <ListingCheckItem
          key={check.code}
          check={check}
          resolveHref={resolveHref}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
};
