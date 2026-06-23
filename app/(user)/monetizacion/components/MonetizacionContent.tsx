"use client";

import { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { billingService } from "@/services/billingService";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import { Button } from "@/components/ui/button";
import BillTable from "./billTable";
import AddonsGrid from "./addonsGrid";
import PlanesGrid from "./planesGrid";

const formatEuros = (amount_cents: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount_cents / 100);

export const MonetizacionContent = () => {
  const { user } = useUser();
  const search_params = useSearchParams();
  const [is_checkout_loading, set_is_checkout_loading] = useState(false);

  const audience = user?.userType ?? "particular";

  const { data: catalog = [], isLoading: catalog_loading } = useQuery({
    queryKey: ["billing-catalog", audience],
    queryFn: () => billingService.getCatalog(audience),
    enabled: !!user,
  });

  const { data: billing_me, refetch: refetch_billing_me } = useQuery({
    queryKey: ["billing-me"],
    queryFn: () => billingService.getMe(),
    enabled: !!user,
  });

  const { data: invoices = [], isLoading: invoices_loading } = useQuery({
    queryKey: ["billing-invoices"],
    queryFn: () => billingService.getInvoices(),
    enabled: !!user,
  });

  useEffect(() => {
    const checkout = search_params.get("checkout");
    if (checkout === "success") {
      toast.success(
        "Pago completado correctamente. Revisa tu correo si acabas de crear tu cuenta.",
      );
      void refetch_billing_me();
    }
    if (checkout === "cancel") {
      toast.error("El pago fue cancelado");
    }
  }, [search_params, refetch_billing_me]);

  const recurring_plans = catalog.filter((plan) => plan.billing_type === "recurring");
  const addon_plans = catalog.filter((plan) => plan.billing_type === "one_time");

  const handleSubscriptionCheckout = async (plan: BillingCatalogPlan, price_id: string) => {
    set_is_checkout_loading(true);
    try {
      const url = await billingService.createSubscriptionCheckout(price_id);
      if (!url) {
        toast.error("No se pudo iniciar el checkout");
        return;
      }
      window.location.href = url;
    } finally {
      set_is_checkout_loading(false);
    }
  };

  const handleAddonCheckout = async (plan: BillingCatalogPlan, price_id: string) => {
    set_is_checkout_loading(true);
    try {
      const url = await billingService.createOneTimeCheckout(price_id);
      if (!url) {
        toast.error("No se pudo iniciar el checkout");
        return;
      }
      window.location.href = url;
    } finally {
      set_is_checkout_loading(false);
    }
  };

  const handlePortal = async () => {
    const url = await billingService.createPortalSession();
    if (!url) {
      toast.error("No se pudo abrir el portal de facturación");
      return;
    }
    window.location.href = url;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Planes y palancas premium</h1>
        </div>
        {billing_me?.stripe_customer_id ? (
          <Button type="button" variant="outline" onClick={handlePortal}>
            Gestionar suscripción
          </Button>
        ) : null}
      </div>

      {billing_me ? (
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700">
          <p>
            Rol actual: <strong>{billing_me.effective_role?.name ?? "Sin rol"}</strong>
          </p>
          <p>
            Anuncios activos: {billing_me.vehicle_listings_used}
            {billing_me.vehicle_listings_max != null
              ? ` / ${billing_me.vehicle_listings_max}`
              : ""}
          </p>
          {billing_me.subscription ? (
            <p>
              Suscripción: {billing_me.subscription.plan_name} ({billing_me.subscription.status})
            </p>
          ) : null}
        </div>
      ) : null}

      <PlanesGrid
        plans={recurring_plans}
        active_plan_id={billing_me?.subscription?.plan_id ?? null}
        loading={catalog_loading || is_checkout_loading}
        onSelectPlan={handleSubscriptionCheckout}
        formatPrice={formatEuros}
      />
      <AddonsGrid
        addons={addon_plans}
        loading={catalog_loading || is_checkout_loading}
        onSelectAddon={handleAddonCheckout}
        formatPrice={formatEuros}
      />
      <BillTable bills={invoices} loading={invoices_loading} formatPrice={formatEuros} />
    </div>
  );
};
