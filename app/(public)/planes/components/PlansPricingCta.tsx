"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const router = useRouter();

  const handleClick = () => {
    if (!planPriceId) {
      toast.error("Este plan no tiene un precio de suscripción disponible");
      return;
    }

    router.push(
      `/billing-plan?plan_price_id=${encodeURIComponent(planPriceId)}`,
    );
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={!planPriceId}
      className={cn(
        "h-11 w-full text-sm font-semibold transition-transform duration-200",
        featured
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:scale-[1.02]"
          : "border border-slate-200 bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]",
      )}
      aria-label={`Quiero el plan ${planName}`}
    >
      Quiero este plan
    </Button>
  );
};
