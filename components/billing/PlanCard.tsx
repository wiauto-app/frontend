"use client";

import { X } from "lucide-react";
import { HiOutlineCheckCircle } from "react-icons/hi";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { listCatalogEntitlementDisplays } from "@/lib/billing/entitlements";
import { cn } from "@/lib/utils";
import { LiaCarSideSolid } from "react-icons/lia";
import { FaStar } from "react-icons/fa";
import { WiautoMatchCard } from "./wiautoMatchCard";

const VISIBLE_FEATURES_COUNT = 5;
/** Frontend-only launch promo: inflate list price, keep Stripe amount unchanged. */
const LAUNCH_PRICE_INFLATE_FACTOR = 1.25;
const LAUNCH_DISCOUNT_PERCENT = 25;

interface PlanCardProps {
  plan: BillingCatalogPlan;
  isActive: boolean;
  formatPrice: (amountCents: number) => string;
  onSelect?: () => void;
  selectDisabled?: boolean;
  /** When true, shows an inflated struck-through price and the real price as a launch offer. */
  showDiscount?: boolean;
}

interface PlanFeatureRow {
  key: string;
  label: string;
  included: boolean;
}

interface FeatureListProps {
  items: PlanFeatureRow[];
}

const FeatureList = ({ items }: FeatureListProps) => (
  <ul className="flex flex-col gap-2">
    {items.map((item) => (
      <li
        key={item.key}
        className={cn(
          "flex items-start gap-2 text-xs",
          !item.included && "text-muted-foreground",
        )}
      >
        {item.included ? (
          <HiOutlineCheckCircle
            className="size-4 shrink-0 text-primary"
            aria-hidden
          />
        ) : (
          <X className="size-4 shrink-0" aria-hidden />
        )}
        <span>{item.label}</span>
      </li>
    ))}
  </ul>
);

export const PlanCard = ({
  plan,
  isActive,
  formatPrice,
  onSelect,
  selectDisabled = false,
  showDiscount = false,
}: PlanCardProps) => {
  const monthly = plan.prices.find((price) => price.interval === "month");
  const primaryPrice = monthly ?? plan.prices[0];
  const entitlementItems = listCatalogEntitlementDisplays(plan.entitlements);
  const included = (plan.features ?? []).filter((feature) => feature.included);
  const excluded = (plan.features ?? []).filter((feature) => !feature.included);

  const allFeatures: PlanFeatureRow[] = [
    ...entitlementItems.map((item) => ({
      key: `entitlement-${item.feature}`,
      label: item.valueLabel ?? item.label,
      included: item.included,
    })),
    ...included.map((feature) => ({
      key: `feature-${feature.id}`,
      label: feature.label,
      included: true,
    })),
    ...excluded.map((feature) => ({
      key: `feature-${feature.id}`,
      label: feature.label,
      included: false,
    })),
  ];

  const visibleFeatures = allFeatures.slice(0, VISIBLE_FEATURES_COUNT);
  const hiddenFeatures = allFeatures.slice(VISIBLE_FEATURES_COUNT);
  const hasHiddenFeatures = hiddenFeatures.length > 0;

  const offerAmountCents = primaryPrice?.amount_cents ?? 0;
  const listAmountCents = Math.round(
    offerAmountCents * LAUNCH_PRICE_INFLATE_FACTOR,
  );
  const intervalLabel = monthly ? "mes" : "año";

  return (
    <div
      className={cn(
        "relative flex flex-col  gap-2 pt-0  bg-background rounded-3xl pb-4",
        isActive && "border border-primary overflow-visible",
        plan.is_featured &&
          "border border-primary bg-primary-soft/10 overflow-hidden",
      )}
    >
      {" "}
      <div
        className={cn(
          "flex items-center justify-center gap-2 text-white  h-8",
          plan.is_featured && !isActive && "bg-primary",
        )}
      >
        {plan.is_featured ? (
          <>
            <FaStar className="size-4" />
            MÁS POPULAR
          </>
        ) : null}
      </div>
      {isActive ? (
        <div className="absolute -top-2.5 flex w-full justify-center">
          <Badge className="rounded-full px-4 text-sm">Seleccionado</Badge>
        </div>
      ) : null}
      <div className="px-3 flex flex-col gap-4">
        <div className="relative flex flex-col items-center gap-3">
          <div className="absolute top-0 right-6">
            {isActive ? (
              <HiOutlineCheckCircle
                className="size-6 text-primary"
                aria-hidden
              />
            ) : null}
          </div>

          <LiaCarSideSolid className="size-14 text-primary" aria-hidden />
          <p className="text-center text-xl font-semibold">{plan.name}</p>
          <CardDescription className="max-w-56 text-center text-xs">
            {plan.description}
          </CardDescription>
        </div>

        <div className="flex flex-col items-center justify-center gap-1">
          {primaryPrice ? (
            showDiscount ? (
              <>
                <Badge className="rounded-full bg-red-100 px-3 text-xs font-semibold text-red-600 hover:bg-red-100">
                  Oferta de lanzamiento
                </Badge>
                <p className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                  <span className="line-through">
                    {formatPrice(listAmountCents)}
                    <span className="font-normal"> /{intervalLabel}</span>
                  </span>
                  <Badge className="rounded-full bg-red-100 px-2 text-xs font-semibold text-red-600 hover:bg-red-100">
                    −{LAUNCH_DISCOUNT_PERCENT}%
                  </Badge>
                </p>
                <p className="text-3xl font-semibold whitespace-nowrap">
                  {formatPrice(offerAmountCents)}{" "}
                  <span className="text-sm text-muted-foreground font-normal">
                    /{intervalLabel}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-3xl font-semibold whitespace-nowrap">
                {formatPrice(offerAmountCents)}{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  /{intervalLabel}
                </span>
              </p>
            )
          ) : null}
          <span className="text-xs text-muted-foreground">IVA no incluido</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <FeatureList items={visibleFeatures} />

          {hasHiddenFeatures ? (
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0 text-xs text-primary"
                    aria-label={`Ver ${hiddenFeatures.length} características más de ${plan.name}`}
                  >
                    Ver más ({hiddenFeatures.length})
                  </Button>
                }
              />
              <PopoverContent
                side="top"
                align="center"
                className="max-h-72 w-64 overflow-y-auto p-3"
              >
                <PopoverHeader>
                  <PopoverTitle>Más características</PopoverTitle>
                </PopoverHeader>
                <FeatureList items={hiddenFeatures} />
              </PopoverContent>
            </Popover>
          ) : null}
          <WiautoMatchCard />
        </div>

        <div className="mt-auto items-center justify-between gap-3">
          <Button
            disabled={isActive || selectDisabled}
            className="w-full"
            onClick={onSelect}
          >
            Seleccionar
          </Button>
        </div>
      </div>
    </div>
  );
};
