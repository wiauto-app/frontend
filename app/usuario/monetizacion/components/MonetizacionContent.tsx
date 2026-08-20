"use client";

import { useState, useEffect, useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { billingService } from "@/services/billingService";
import type {
  BillingCatalogPlan,
  MonetizacionAddon,
} from "@/interfaces/billing.interface";
import {
  formatUsageVsLimit,
  getEntitlementFeatureLabel,
} from "@/lib/billing/entitlements";
import { absoluteUrl } from "@/lib/seo/absolute-url";
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
  const router = useRouter();
  const search_params = useSearchParams();
  const [is_checkout_loading, set_is_checkout_loading] = useState(false);

  const { data: recurring_plans = [], isLoading: catalog_loading } = useQuery({
    queryKey: ["billing-catalog", "recurring"],
    queryFn: () => billingService.getCatalog("recurring"),
    enabled: !!user,
  });

  const {
    data: assistant_packs = [],
    isLoading: packs_loading,
  } = useQuery({
    queryKey: ["assistant-credit-packs-catalog"],
    queryFn: () => billingService.getAssistantCreditPacksCatalog(),
    enabled: !!user,
  });

  const {
    data: featured_offers = [],
    isLoading: offers_loading,
  } = useQuery({
    queryKey: ["featured-listing-offers-catalog"],
    queryFn: () => billingService.getFeaturedListingOffersCatalog(),
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

  const addons = useMemo((): MonetizacionAddon[] => {
    const packAddons: MonetizacionAddon[] = assistant_packs
      .filter((pack) => pack.is_active && pack.stripe_price_id)
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((pack) => ({
        id: pack.id,
        kind: "assistant_credits",
        title: pack.title,
        description: pack.description,
        amount_cents: pack.amount_cents,
        currency: pack.currency,
        detail_label: `${pack.credits_quantity} consultas`,
      }));

    const offerAddons: MonetizacionAddon[] = featured_offers
      .filter((offer) => offer.is_active && offer.stripe_price_id)
      .sort((left, right) => left.sort_order - right.sort_order)
      .map((offer) => ({
        id: offer.id,
        kind: "featured_listing",
        title: offer.title,
        description: offer.description,
        amount_cents: offer.amount_cents,
        currency: offer.currency,
        detail_label: `${offer.duration_days} días de destacado`,
      }));

    return [...packAddons, ...offerAddons];
  }, [assistant_packs, featured_offers]);

  const vehiclesUsage = formatUsageVsLimit(
    billing_me?.entitlements?.vehicles,
    billing_me?.usage?.listings_used ?? billing_me?.vehicle_listings_used,
    billing_me?.quotas?.max_listings ?? billing_me?.vehicle_listings_max,
  );

  const aiRequestsUsage = formatUsageVsLimit(billing_me?.entitlements?.ai_requests);

  const addons_loading = packs_loading || offers_loading;

  const handleSubscriptionCheckout = async (
    plan: BillingCatalogPlan,
    price_id: string,
  ) => {
    set_is_checkout_loading(true);
    try {
      const result = await billingService.createSubscriptionCheckout(price_id);
      if (!result.checkoutUrl) {
        if (result.status === 403) {
          toast.error(
            result.message ?? "No tienes permiso para contratar este plan.",
          );
          return;
        }
        toast.error(result.message ?? "No se pudo iniciar el checkout");
        return;
      }
      window.location.href = result.checkoutUrl;
    } finally {
      set_is_checkout_loading(false);
    }
  };

  const handleAddonCheckout = async (addon: MonetizacionAddon) => {
    if (addon.kind === "featured_listing") {
      toast.message("Elige el anuncio que quieres destacar", {
        description: "Te llevamos a Mis anuncios para completar la compra.",
      });
      router.push("/usuario/mis-anuncios");
      return;
    }

    set_is_checkout_loading(true);
    try {
      const url = await billingService.createAssistantCreditsCheckout(addon.id, {
        success_url: absoluteUrl("/usuario/monetizacion?checkout=success"),
        cancel_url: absoluteUrl("/usuario/monetizacion?checkout=cancel"),
      });
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
        {billing_me?.subscription && billing_me?.stripe_customer_id ? (
          <Button type="button" variant="outline" onClick={handlePortal}>
            Gestionar suscripción
          </Button>
        ) : null}
      </div>

      {billing_me ? (
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-700 space-y-1">
          {vehiclesUsage ? (
            <p>
              {getEntitlementFeatureLabel("vehicles")}: <strong>{vehiclesUsage}</strong>
            </p>
          ) : null}
          {aiRequestsUsage && billing_me.entitlements?.ai_requests ? (
            <p>
              {getEntitlementFeatureLabel("ai_requests")}: <strong>{aiRequestsUsage}</strong>
            </p>
          ) : null}
          {billing_me.subscription ? (
            <p>
              Suscripción: {billing_me.subscription.plan_name} ({billing_me.subscription.status})
            </p>
          ) : billing_me.access_grant ? (
            <p>
              Plan concedido: {billing_me.access_grant.plan_name}
              {billing_me.access_grant.expires_at
                ? ` · válido hasta ${new Date(billing_me.access_grant.expires_at).toLocaleDateString("es-ES")}`
                : " · sin vencimiento"}
            </p>
          ) : null}
        </div>
      ) : null}

      <PlanesGrid
        plans={recurring_plans}
        active_plan_id={billing_me?.plan_id ?? billing_me?.subscription?.plan_id ?? null}
        loading={catalog_loading || is_checkout_loading}
        onSelectPlan={handleSubscriptionCheckout}
        formatPrice={formatEuros}
      />
      <AddonsGrid
        addons={addons}
        loading={addons_loading || is_checkout_loading}
        onSelectAddon={handleAddonCheckout}
        formatPrice={formatEuros}
      />
      <BillTable bills={invoices} loading={invoices_loading} formatPrice={formatEuros} />
    </div>
  );
};
