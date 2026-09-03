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
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { listCatalogEntitlementDisplays } from "@/lib/billing/entitlements";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: BillingCatalogPlan;
  isActive: boolean;
  formatPrice: (amountCents: number) => string;
  onSelect?: () => void;
  selectDisabled?: boolean;
}

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

  return (
    <Card
      size="sm"
      className={cn(
        "relative flex flex-col overflow-visible",
        isActive && "ring ring-primary",
      )}
    >
      {isActive ? (
        <div className="absolute -top-4 flex w-full justify-center">
          <Badge className="h-8 rounded-md px-4 text-base">Seleccionado</Badge>
        </div>
      ) : null}

      <CardHeader className="relative flex flex-col items-center gap-3">
        <div className="absolute top-0 right-6 ">
          {isActive ? (
            <HiOutlineCheckCircle
              className="size-6 text-primary"
              aria-hidden
            />
          ) : null}
        </div>

        <TbCarGarage className="size-16 text-primary" aria-hidden />
        <p className="text-center text-2xl font-bold">{plan.name}</p>
        <CardDescription className="max-w-56 text-center">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center gap-2">
        {primaryPrice ? (
          <p className="text-3xl font-bold whitespace-nowrap">
            {formatPrice(primaryPrice.amount_cents)}{" "}
            <span className="text-lg text-muted-foreground">
              / {monthly ? "mes" : "año"}
            </span>
          </p>
        ) : null}
        <span className="text-sm text-muted-foreground">IVA no incluido</span>
      </CardContent>

      <CardContent className=" flex justify-center">
        <ul className="flex flex-col gap-2">
          {entitlementItems.map((item) => (
            <li key={item.feature} className="flex items-start gap-2">
              <HiOutlineCheckCircle
                className="size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>{item.valueLabel}</span>
            </li>
          ))}
          {included.map((feature) => (
            <li key={feature.id} className="flex items-start gap-2">
              <HiOutlineCheckCircle
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden
              />
              <span>{feature.label}</span>
            </li>
          ))}
          {excluded.map((feature) => (
            <li
              key={feature.id}
              className="flex items-start gap-2 text-muted-foreground"
            >
              <X
                className="mt-0.5 size-4 shrink-0 rounded-full bg-muted p-0.5"
                aria-hidden
              />
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
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
