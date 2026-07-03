"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { billingService } from "@/services/billingService";

interface AssistantCreditsPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatEuros = (amount_cents: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount_cents / 100);

const isAssistantCreditsPlan = (plan: BillingCatalogPlan): boolean =>
  plan.billing_type === "one_time" &&
  plan.effect_config?.type === "assistant_credits" &&
  typeof plan.effect_config.credits === "number" &&
  plan.effect_config.credits > 0;

export const AssistantCreditsPurchaseDialog = ({
  open,
  onOpenChange,
}: AssistantCreditsPurchaseDialogProps) => {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const { data: catalog = [], isLoading } = useQuery({
    queryKey: ["billing-catalog", "buyer", "assistant-credits"],
    queryFn: () => billingService.getCatalog("buyer"),
    enabled: open,
  });

  const creditPacks = useMemo(
    () =>
      catalog
        .filter(isAssistantCreditsPlan)
        .sort(
          (left, right) =>
            (left.effect_config?.credits ?? 0) - (right.effect_config?.credits ?? 0),
        ),
    [catalog],
  );

  const handleCheckout = async (plan: BillingCatalogPlan) => {
    const price = plan.prices[0];

    if (!price?.id) {
      toast.error("Este pack no tiene un precio configurado");
      return;
    }

    setLoadingPriceId(price.id);

    try {
      const checkoutUrl = await billingService.createOneTimeCheckout(
        price.id,
        undefined,
        {
          success_url: absoluteUrl("/asistente/chat?checkout=success"),
          cancel_url: absoluteUrl("/asistente/chat?checkout=cancel"),
        },
      );

      if (!checkoutUrl) {
        toast.error("No se pudo iniciar el checkout");
        return;
      }

      window.location.href = checkoutUrl;
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Comprar consultas</DialogTitle>
          <DialogDescription>
            Elige un pack de consultas para seguir usando el asistente cuando agotes
            tu cuota mensual gratuita.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : creditPacks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay packs de consultas disponibles en este momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {creditPacks.map((plan) => {
              const credits = plan.effect_config?.credits ?? 0;
              const price = plan.prices[0];
              const isLoadingCheckout = loadingPriceId === price?.id;

              return (
                <div
                  key={plan.id}
                  className="flex flex-col rounded-xl border p-4 shadow-sm"
                >
                  <p className="text-2xl font-bold text-slate-900">{credits}</p>
                  <p className="text-sm text-muted-foreground">consultas</p>
                  <p className="mt-4 text-lg font-semibold text-primary">
                    {price ? formatEuros(price.amount_cents) : "—"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.name}</p>
                  <Button
                    className="mt-4"
                    disabled={!price?.id || isLoadingCheckout}
                    onClick={() => void handleCheckout(plan)}
                    type="button"
                  >
                    {isLoadingCheckout ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="size-4" />
                    )}
                    Comprar
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
