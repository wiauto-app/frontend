"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Car, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MyListingsHeader } from "./MyListingsHeader";
import { MyListingsSummaryCards } from "./MyListingsSummaryCards";
import { MyListingsTable } from "./MyListingsTable";
import { MyListingsPromoSidebar } from "./MyListingsPromoSidebar";
import { MyListingsHelpSection } from "./MyListingsHelpSection";
import { MyListingsFiltersBar } from "./MyListingsFiltersBar";
import { MyListingsPagination } from "./MyListingsPagination";
import { useMyListingsPage } from "../hooks/useMyListingsPage";
import { aggregateListingStats } from "../utils/aggregateListingStats";
import { useUser } from "@/app/contexts/auth/useUser";
import { useEntitlements } from "@/hooks/useEntitlements";
import { trackPendingPurchase } from "@/lib/analytics/events";
import { UpgradeListingAdd } from "./upgradeListingAdd";

export const MyListing = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const { isPrivileged, isSubscribed, entitlements } = useEntitlements();
  const searchParams = useSearchParams();

  const isAuthenticated = Boolean(user);
  const {
    listings,
    page,
    totalPages,
    onPageChange,
    filters,
    updateFilters,
    resetFilters,
    billingMe,
    featureDurationDays,
    featuredSlots,
    isLoading,
    isBillingLoading,
    error,
    refetch,
    refetchBillingMe,
  } = useMyListingsPage({
    enabled: isAuthenticated,
  });

  const aggregatedStats = useMemo(
    () => aggregateListingStats(listings),
    [listings],
  );

  const hasActiveFilters = Boolean(
    filters.status ||
      filters.makeId ||
      filters.modelId ||
      filters.sinceCreatedAt ||
      filters.untilCreatedAt,
  );

  const canFeatureIncluded = featuredSlots.canUseIncluded;

  const showFeaturedCard =
    isPrivileged ||
    featuredSlots.unlimited ||
    (typeof featuredSlots.limit === "number" && featuredSlots.limit > 0);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      trackPendingPurchase();
      toast.success("Pago completado. Tu anuncio se destacará en breve.");
      void refetch();
      void refetchBillingMe();
    }
    if (checkout === "cancel") {
      toast.error("El pago fue cancelado");
    }
  }, [searchParams, refetch, refetchBillingMe]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MyListingsHeader />

      <MyListingsSummaryCards
        stats={aggregatedStats}
        listingsUsed={
          billingMe?.entitlements?.vehicles?.used ??
          billingMe?.usage?.listings_used
        }
        listingsMax={
          billingMe?.entitlements?.vehicles?.unlimited
            ? null
            : (billingMe?.entitlements?.vehicles?.limit ??
              billingMe?.quotas?.max_listings ??
              billingMe?.vehicle_listings_max)
        }
        showFeaturedCard={showFeaturedCard}
        featuredUsed={featuredSlots.used}
        featuredMax={featuredSlots.limit}
        featuredUnlimited={featuredSlots.unlimited}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          {isSubscribed && (
            <MyListingsFiltersBar
              filters={filters}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          )}

          {isLoading || isBillingLoading ? (
            <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white py-16 shadow-sm">
              <Loader2
                className="h-8 w-8 animate-spin text-blue-600"
                aria-hidden
              />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-red-600 shadow-sm">
              No se pudieron cargar tus anuncios. Intenta de nuevo más tarde.
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <Car className="mx-auto h-12 w-12 text-gray-300" aria-hidden />
              {hasActiveFilters ? (
                <>
                  <p className="mt-4 text-gray-600">
                    No hay anuncios que coincidan con los filtros aplicados
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                  >
                    Limpiar filtros
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-4 text-gray-600">
                    Aún no tienes anuncios publicados
                  </p>
                  <Link
                    href="/publicar"
                    className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
                  >
                    Nuevo anuncio
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <MyListingsTable listings={listings} />
              <MyListingsPagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </>
          )}
          {entitlements.vehicles.limit === 2 ? <UpgradeListingAdd /> : null}
        </div>

        <MyListingsPromoSidebar listings={listings} />
      </div>

      <MyListingsHelpSection
        featureDurationDays={featureDurationDays}
        canFeatureIncluded={canFeatureIncluded}
      />
    </div>
  );
};
