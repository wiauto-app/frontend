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
import type { AssistantCreditPack } from "@/interfaces/billing.interface";
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

export const AssistantCreditsPurchaseDialog = ({
  open,
  onOpenChange,
}: AssistantCreditsPurchaseDialogProps) => {
  const [loadingPackId, setLoadingPackId] = useState<string | null>(null);

  const { data: catalog = [], isLoading } = useQuery({
    queryKey: ["assistant-credit-packs-catalog"],
    queryFn: () => billingService.getAssistantCreditPacksCatalog(),
    enabled: open,
  });

  const creditPacks = useMemo(
    () =>
      catalog
        .filter((pack) => pack.is_active)
        .sort(
          (left, right) =>
            left.sort_order - right.sort_order ||
            left.credits_quantity - right.credits_quantity,
        ),
    [catalog],
  );

  const handleCheckout = async (pack: AssistantCreditPack) => {
    if (!pack.stripe_price_id) {
      toast.error("Este pack no tiene un precio configurado");
      return;
    }

    setLoadingPackId(pack.id);

    try {
      const checkoutUrl = await billingService.createAssistantCreditsCheckout(
        pack.id,
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
      setLoadingPackId(null);
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
            {creditPacks.map((pack) => {
              const isLoadingCheckout = loadingPackId === pack.id;

              return (
                <div
                  key={pack.id}
                  className="flex flex-col rounded-xl border p-4 shadow-sm"
                >
                  <p className="text-2xl font-bold text-slate-900">
                    {pack.credits_quantity}
                  </p>
                  <p className="text-sm text-muted-foreground">consultas</p>
                  <p className="mt-4 text-lg font-semibold text-primary">
                    {formatEuros(pack.amount_cents)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{pack.title}</p>
                  {pack.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {pack.description}
                    </p>
                  ) : null}
                  <Button
                    className="mt-4"
                    disabled={!pack.stripe_price_id || isLoadingCheckout}
                    onClick={() => void handleCheckout(pack)}
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
