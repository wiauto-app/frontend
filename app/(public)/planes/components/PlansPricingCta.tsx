"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { billingService } from "@/services/billingService";

interface PlansPricingCtaProps {
  planName: string;
  planPriceId: string | null;
  featured?: boolean;
}

export const PlansPricingCta = ({
  planName,
  planPriceId,
  featured = false,
}: PlansPricingCtaProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!planPriceId) {
      toast.error("Este plan no tiene un precio mensual disponible");
      return;
    }

    setIsLoading(true);
    try {
      const result = await billingService.createPublicSubscriptionCheckout(planPriceId);

      if (!result.checkoutUrl) {
        if (result.status === 403) {
          toast.error(
            result.message ??
              "Este plan personalizado no está disponible en el catálogo público.",
          );
          return;
        }

        toast.error(
          result.message ?? "No se pudo iniciar el checkout. Inténtalo de nuevo.",
        );
        return;
      }

      window.location.href = result.checkoutUrl;
    } catch {
      toast.error("No se pudo iniciar el checkout. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isLoading || !planPriceId}
      className={cn(
        "h-11 w-full text-sm font-semibold transition-transform duration-200",
        featured
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:scale-[1.02]"
          : "border border-slate-200 bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]",
      )}
      aria-label={`Quiero el plan ${planName}`}
      aria-busy={isLoading}
    >
      {isLoading ? "Redirigiendo..." : "Quiero este plan"}
    </Button>
  );
};
