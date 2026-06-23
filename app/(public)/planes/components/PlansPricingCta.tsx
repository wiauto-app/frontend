"use client";

import { useState } from "react";
import { toast } from "sonner";

import { billingService } from "@/services/billingService";
import { Button } from "@/components/ui/button";

type PlansPricingCtaProps = {
  plan_name: string;
  plan_price_id: string | null;
};

export const PlansPricingCta = ({ plan_name, plan_price_id }: PlansPricingCtaProps) => {
  const [is_loading, set_is_loading] = useState(false);

  const handleClick = async () => {
    if (!plan_price_id) {
      toast.error("Este plan no tiene un precio mensual disponible");
      return;
    }

    set_is_loading(true);
    try {
      const checkout_url = await billingService.createPublicSubscriptionCheckout(plan_price_id);

      if (!checkout_url) {
        toast.error("No se pudo iniciar el checkout. Inténtalo de nuevo.");
        return;
      }

      window.location.href = checkout_url;
    } catch {
      toast.error("No se pudo iniciar el checkout. Inténtalo de nuevo.");
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={is_loading || !plan_price_id}
      className="w-full bg-blue-500 text-white hover:bg-blue-600"
      aria-label={`Quiero el plan ${plan_name}`}
    >
      {is_loading ? "Redirigiendo..." : "Quiero este plan"}
    </Button>
  );
};
