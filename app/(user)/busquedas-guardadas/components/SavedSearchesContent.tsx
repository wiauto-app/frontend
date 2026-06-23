"use client";

import Link from "next/link";
import { LayoutGrid, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedSearchesPage } from "../hooks/useSavedSearchesPage";
import { SavedSearchCard } from "./SavedSearchCard";
import { GlobalNotificationPreferences } from "./GlobalNotificationPreferences";

export const SavedSearchesContent = () => {
  const {
    alerts,
    notificationPreferences,
    isLoadingAlerts,
    isLoadingNotificationPreferences,
    alertsError,
    notificationPreferencesError,
    updateAlert,
    isUpdatingAlert,
    removeAlert,
    isRemovingAlert,
    markViewed,
    updateNotificationPreferences,
    isUpdatingNotificationPreferences,
  } = useSavedSearchesPage();

  const handleUpdateAlert = async (
    alertId: string,
    payload: Parameters<typeof updateAlert>[0]["payload"],
  ) => {
    try {
      await updateAlert({ alertId, payload });
      toast.success("Búsqueda actualizada");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la búsqueda",
      );
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await removeAlert(alertId);
      toast.success("Búsqueda eliminada");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la búsqueda",
      );
    }
  };

  const handleExpand = async (alertId: string) => {
    try {
      await markViewed(alertId);
    } catch {
      // El contador se actualiza en segundo plano; no bloqueamos la UI.
    }
  };

  const handleUpdatePreferences = async (
    payload: Parameters<typeof updateNotificationPreferences>[0],
  ) => {
    try {
      await updateNotificationPreferences(payload);
      toast.success("Preferencias actualizadas");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar las preferencias",
      );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Búsquedas guardadas</h1>
        </div>
        <Link
          href="/vehiculos"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nueva búsqueda
        </Link>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        {isLoadingAlerts && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoadingAlerts && alertsError && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {alertsError instanceof Error
              ? alertsError.message
              : "No se pudieron cargar las búsquedas guardadas"}
          </div>
        )}

        {!isLoadingAlerts && !alertsError && alerts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Search className="h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-600">
              Guarda búsquedas desde un anuncio o el listado de vehículos.
            </p>
            <Link
              href="/vehiculos"
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Ir al listado de vehículos
            </Link>
          </div>
        )}

        {!isLoadingAlerts &&
          !alertsError &&
          alerts.map((alert) => (
            <SavedSearchCard
              key={alert.id}
              alert={alert}
              onUpdate={handleUpdateAlert}
              onDelete={handleDeleteAlert}
              onExpand={handleExpand}
              isUpdating={isUpdatingAlert}
              isDeleting={isRemovingAlert}
            />
          ))}
      </div>

      {isLoadingNotificationPreferences && (
        <Skeleton className="h-64 w-full rounded-xl" />
      )}

      {!isLoadingNotificationPreferences && notificationPreferencesError && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          {notificationPreferencesError instanceof Error
            ? notificationPreferencesError.message
            : "No se pudieron cargar las preferencias globales"}
        </div>
      )}

      {!isLoadingNotificationPreferences &&
        notificationPreferences &&
        !notificationPreferencesError && (
          <GlobalNotificationPreferences
            preferences={notificationPreferences}
            onUpdate={handleUpdatePreferences}
            isUpdating={isUpdatingNotificationPreferences}
          />
        )}
    </div>
  );
};
