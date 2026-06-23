"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Car, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@/app/contexts/auth/authContext";
import { MyListingsHeader } from "./MyListingsHeader";
import { MyListingsSummaryCards } from "./MyListingsSummaryCards";
import { MyListingsTable } from "./MyListingsTable";
import { MyListingsPromoSidebar } from "./MyListingsPromoSidebar";
import { MyListingsHelpSection } from "./MyListingsHelpSection";
import { ScheduleListingDialog } from "./ScheduleListingDialog";
import { useMyListingsPage } from "../hooks/useMyListingsPage";
import { aggregateListingStats } from "../utils/aggregateListingStats";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";
import { useUser } from "@/app/contexts/auth/useUser";

const formatEuros = (amountCents: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);

export const MyListing = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const [scheduleListing, setScheduleListing] = useState<OwnerVehicleListItem | null>(
    null,
  );

  const audience = user?.userType ?? "particular";
  const isAuthenticated = Boolean(user);

  const {
    listings,
    billingMe,
    featurePlan,
    featurePrice,
    isLoading,
    isBillingLoading,
    error,
    refetch,
    refetchBillingMe,
    duplicate,
    renew,
    featureListing,
    schedule,
    updateStatus,
    remove,
    isDuplicating,
    isRenewing,
    isFeaturing,
    isScheduling,
    isUpdatingStatus,
    isRemoving,
  } = useMyListingsPage({
    audience,
    enabled: isAuthenticated,
  });

  const aggregatedStats = useMemo(
    () => aggregateListingStats(listings),
    [listings],
  );

  const featurePriceLabel = featurePrice ? formatEuros(featurePrice.amount_cents) : null;

  const isMutating =
    isDuplicating ||
    isRenewing ||
    isFeaturing ||
    isScheduling ||
    isUpdatingStatus ||
    isRemoving;

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
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

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto mt-10">
        <Car className="mx-auto h-12 w-12 text-gray-300" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Inicia sesión para ver tus anuncios
        </h2>
        <p className="mt-2 text-gray-500">
          Debes iniciar sesión para gestionar tus publicaciones
        </p>
        <Link
          href="/iniciar-sesion"
          className="mt-4 inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const handleRenew = async (id: string) => {
    try {
      await renew(id);
      toast.success("Anuncio renovado correctamente");
    } catch {
      toast.error("No se pudo renovar el anuncio");
    }
  };

  const handleFeature = async (id: string) => {
    try {
      await featureListing(id);
    } catch {
      toast.error("No se pudo iniciar el checkout de destacado");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicate(id);
      toast.success("Anuncio duplicado correctamente");
    } catch {
      toast.error("No se pudo duplicar el anuncio");
    }
  };

  const handleSchedule = async (id: string, scheduled_publish_at: string) => {
    try {
      await schedule({ id, scheduled_publish_at });
      toast.success("Publicación programada correctamente");
    } catch {
      toast.error("No se pudo programar el anuncio");
    }
  };

  const handleToggleStatus = async (
    id: string,
    nextStatus: "active" | "inactive",
  ) => {
    try {
      await updateStatus({ id, status: nextStatus });
      toast.success(
        nextStatus === "active"
          ? "Anuncio activado correctamente"
          : "Anuncio pausado correctamente",
      );
    } catch {
      toast.error("No se pudo cambiar el estado del anuncio");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await remove(id);
      toast.success("Anuncio eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el anuncio");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <MyListingsHeader />

      <MyListingsSummaryCards
        stats={aggregatedStats}
        listingsUsed={billingMe?.vehicle_listings_used}
        listingsMax={billingMe?.vehicle_listings_max}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="min-w-0 space-y-4">
          {isLoading || isBillingLoading ? (
            <div className="flex items-center justify-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 bg-white rounded-xl border border-gray-100 shadow-sm">
              No se pudieron cargar tus anuncios. Intenta de nuevo más tarde.
            </div>
          ) : listings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
              <Car className="mx-auto h-12 w-12 text-gray-300" aria-hidden />
              <p className="mt-4 text-gray-600">Aún no tienes anuncios publicados</p>
              <Link
                href="/crear-vehiculo"
                className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                Nuevo anuncio
              </Link>
            </div>
          ) : (
            <MyListingsTable
              listings={listings}
              onRenew={handleRenew}
              onFeature={handleFeature}
              onDuplicate={handleDuplicate}
              onSchedule={setScheduleListing}
              onRemove={handleRemove}
              onToggleStatus={handleToggleStatus}
              isMutating={isMutating}
              featurePriceLabel={featurePriceLabel}
            />
          )}
        </div>

        <MyListingsPromoSidebar
          listings={listings}
          featurePlan={featurePlan}
          onFeature={handleFeature}
          isFeatureLoading={isFeaturing}
        />
      </div>

      <MyListingsHelpSection />

      <ScheduleListingDialog
        listing={scheduleListing}
        open={scheduleListing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setScheduleListing(null);
          }
        }}
        onSchedule={handleSchedule}
        isSubmitting={isScheduling}
      />
    </div>
  );
};
