"use client";

import { X } from "lucide-react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { TbCarGarage } from "react-icons/tb";

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

const VISIBLE_FEATURES_COUNT = 5;

interface PlanCardProps {
  plan: BillingCatalogPlan;
  isActive: boolean;
  formatPrice: (amountCents: number) => string;
  onSelect?: () => void;
  selectDisabled?: boolean;
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

  return (
    <Card
      size="sm"
      className={cn(
        "relative flex flex-col overflow-visible gap-2",
        isActive && "ring ring-primary",
      )}
    >
      {isActive ? (
        <div className="absolute -top-2.5 flex w-full justify-center">
          <Badge className="rounded-full px-4 text-sm">Seleccionado</Badge>
        </div>
      ) : null}

      <CardHeader className="relative flex flex-col items-center gap-3">
        <div className="absolute top-0 right-6">
          {isActive ? (
            <HiOutlineCheckCircle className="size-6 text-primary" aria-hidden />
          ) : null}
        </div>

        <TbCarGarage className="size-14 text-primary" aria-hidden />
        <p className="text-center text-xl font-semibold">{plan.name}</p>
        <CardDescription className="max-w-56 text-center text-xs">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center">
        {primaryPrice ? (
          <p className="text-3xl font-semibold whitespace-nowrap">
            {formatPrice(primaryPrice.amount_cents)}{" "}
            <span className="text-sm text-muted-foreground font-normal">
              /{monthly ? "mes" : "año"}
            </span>
          </p>
        ) : null}
        <span className="text-xs text-muted-foreground">IVA no incluido</span>
      </CardContent>

      <CardContent className="flex flex-col items-center gap-2">
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
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between gap-3">
        <Button
          disabled={isActive || selectDisabled}
          className="w-full"
          onClick={onSelect}
        >
          Seleccionar
        </Button>
      </CardFooter>
    </Card>
  );
};
