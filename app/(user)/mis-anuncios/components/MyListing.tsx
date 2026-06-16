"use client";

import { useContext, useState } from "react";
import Link from "next/link";
import { Car, LayoutGrid, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@/app/contexts/auth/authContext";
import { MyListingCard } from "../components/MyListingCard";
import { ScheduleListingDialog } from "../components/ScheduleListingDialog";
import { useMyListingsPage } from "../hooks/useMyListingsPage";
import type { OwnerVehicleListItem } from "@/interfaces/owner-vehicle.interface";

export function MyListing() {
  const authContext = useContext(AuthContext);
  const [scheduleListing, setScheduleListing] = useState<OwnerVehicleListItem | null>(
    null,
  );

  const {
    listings,
    isLoading,
    error,
    duplicate,
    renew,
    schedule,
    updateStatus,
    remove,
    isDuplicating,
    isRenewing,
    isScheduling,
    isUpdatingStatus,
    isRemoving,
  } = useMyListingsPage();

  const isMutating =
    isDuplicating || isRenewing || isScheduling || isUpdatingStatus || isRemoving;

  if (authContext?.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden />
      </div>
    );
  }

  if (!authContext?.isAuthenticated || !authContext.user) {
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" aria-hidden />
          <h1 className="text-2xl font-bold text-gray-900">Mis anuncios</h1>
        </div>
        <Link
          href="/crear-vehiculo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Nuevo anuncio
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            No se pudieron cargar tus anuncios. Intenta de nuevo más tarde.
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center">
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
          <div className="divide-y divide-gray-100">
            {listings.map((listing) => (
              <MyListingCard
                key={listing.id}
                listing={listing}
                onRenew={handleRenew}
                onDuplicate={handleDuplicate}
                onSchedule={setScheduleListing}
                onRemove={handleRemove}
                onToggleStatus={handleToggleStatus}
                isMutating={isMutating}
              />
            ))}
          </div>
        )}
      </div>

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
}
