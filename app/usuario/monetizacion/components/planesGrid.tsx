"use client";

import { Check, X } from "lucide-react";
import { TbCarGarage } from "react-icons/tb";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { listCatalogEntitlementDisplays } from "@/lib/billing/entitlements";
import { cn } from "@/lib/utils";

interface PlanesGridProps {
  plans: BillingCatalogPlan[];
  active_plan_id: string | null;
  loading?: boolean;
  onSelectPlan: (plan: BillingCatalogPlan, price_id: string) => void;
  formatPrice: (amount_cents: number) => string;
}

const PlanesGrid = ({
  plans,
  active_plan_id,
  formatPrice,
}: PlanesGridProps) => {
  if (!plans.length) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-gray-600">
        No hay planes de suscripción disponibles para tu perfil.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {plans.map((plan) => {
        const monthly = plan.prices.find((price) => price.interval === "month");
        const primaryPrice = monthly ?? plan.prices[0];
        const isActive = active_plan_id === plan.id;
        const entitlementItems = listCatalogEntitlementDisplays(
          plan.entitlements,
        );
        const included = (plan.features ?? []).filter(
          (feature) => feature.included,
        );
        const excluded = (plan.features ?? []).filter(
          (feature) => !feature.included,
        );
        const hasDetails =
          entitlementItems.length > 0 ||
          included.length > 0 ||
          excluded.length > 0;

        return (
          <Card
            key={plan.id}
            size="sm"
            className={cn(
              "relative flex flex-col overflow-visible",
              isActive && "bg-[#EFF4FE] ring ring-primary",
            )}
          >
            {isActive ? (
              <div className="absolute -top-4 flex w-full justify-center">
                <Badge className="h-8 rounded-md px-4 text-base">
                  Seleccionado
                </Badge>
              </div>

) : null}

            <CardHeader className="relative flex items-center gap-3">
              <div className="absolute top-0 right-6 size-4 rounded-full ring-2 ring-primary">
                {isActive ? (
                  <Check className="size-4 text-primary" aria-hidden />
                ) : null}
              </div>

              <TbCarGarage className="size-16 text-primary" aria-hidden />
              <div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </div>
            </CardHeader>

            <Separator className="bg-muted-foreground/40" />

            <CardFooter className="mt-auto items-center justify-between gap-3">
              {hasDetails ? (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto px-0 text-sm text-primary"
                        aria-label={`Ver más detalle del plan ${plan.name}`}
                      >
                        Ver más detalle
                      </Button>
                    }
                  />
                  <PopoverContent
                    align="start"
                    side="top"
                    className="w-80 max-h-80 gap-3 overflow-y-auto"
                  >
                    <PopoverHeader>
                      <PopoverTitle>{plan.name}</PopoverTitle>
                      <PopoverDescription>
                        Incluido en este plan
                      </PopoverDescription>
                    </PopoverHeader>

                    <ul className="flex flex-col gap-2">
                      {entitlementItems.map((item) => (
                        <li
                          key={item.feature}
                          className="flex items-start gap-2"
                        >
                          <Check
                            className="mt-0.5 size-4 shrink-0 rounded-full bg-primary p-0.5 text-primary-foreground"
                            aria-hidden
                          />
                          <span>{item.valueLabel}</span>
                        </li>
                      ))}
                      {included.map((feature) => (
                        <li
                          key={feature.id}
                          className="flex items-start gap-2"
                        >
                          <Check
                            className="mt-0.5 size-4 shrink-0 rounded-full bg-primary p-0.5 text-primary-foreground"
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
                  </PopoverContent>
                </Popover>
              ) : (
                <span className="text-sm text-muted-foreground">Sin detalle</span>
              )}

              {primaryPrice ? (
                <p className="text-lg font-bold whitespace-nowrap">
                  {formatPrice(primaryPrice.amount_cents)} /{" "}
                  {monthly ? "mensual" : "anual"}
                </p>
              ) : null}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PlanesGrid;
