"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { UpdateAlertPayload } from "@/interfaces/alert.interface";
import type { UpdateAlertNotificationPreferencesPayload } from "@/interfaces/alert-notification-preferences.interface";
import {
  ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY,
  ALERTS_QUERY_KEY,
  alertService,
} from "@/services/alertService";

export { ALERTS_QUERY_KEY, ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY };

export const useSavedSearchesPage = () => {
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ALERTS_QUERY_KEY,
    queryFn: async () => {
      const response = await alertService.findAll();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar las búsquedas guardadas",
        );
      }
      return response.data;
    },
  });

  const notificationPreferencesQuery = useQuery({
    queryKey: ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY,
    queryFn: async () => {
      const response = await alertService.getNotificationPreferences();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message ||
            "No se pudieron cargar las preferencias de notificación",
        );
      }
      return response.data;
    },
  });

  const invalidateAlerts = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ALERTS_QUERY_KEY });
  }, [queryClient]);

  const invalidateNotificationPreferences = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY,
    });
  }, [queryClient]);

  const updateAlertMutation = useMutation({
    mutationFn: async ({
      alertId,
      payload,
    }: {
      alertId: string;
      payload: UpdateAlertPayload;
    }) => {
      const response = await alertService.update(alertId, payload);
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo actualizar la búsqueda",
        );
      }
      return response.data;
    },
    onSuccess: invalidateAlerts,
  });

  const removeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await alertService.remove(alertId);
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudo eliminar la búsqueda",
        );
      }
    },
    onSuccess: invalidateAlerts,
  });

  const markViewedMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await alertService.markViewed(alertId);
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo marcar la búsqueda como vista",
        );
      }
      return response.data;
    },
    onSuccess: async () => {
      await invalidateAlerts();
    },
  });

  const updateNotificationPreferencesMutation = useMutation({
    mutationFn: async (payload: UpdateAlertNotificationPreferencesPayload) => {
      const response = await alertService.updateNotificationPreferences(payload);
      if (!response.ok || !response.data) {
        throw new Error(
          response.message ||
            "No se pudieron actualizar las preferencias de notificación",
        );
      }
      return response.data;
    },
    onSuccess: invalidateNotificationPreferences,
  });

  return {
    alerts: alertsQuery.data ?? [],
    notificationPreferences: notificationPreferencesQuery.data ?? null,
    isLoadingAlerts: alertsQuery.isLoading,
    isLoadingNotificationPreferences:
      notificationPreferencesQuery.isLoading,
    alertsError: alertsQuery.error,
    notificationPreferencesError: notificationPreferencesQuery.error,
    updateAlert: updateAlertMutation.mutateAsync,
    isUpdatingAlert: updateAlertMutation.isPending,
    removeAlert: removeAlertMutation.mutateAsync,
    isRemovingAlert: removeAlertMutation.isPending,
    markViewed: markViewedMutation.mutateAsync,
    isMarkingViewed: markViewedMutation.isPending,
    updateNotificationPreferences:
      updateNotificationPreferencesMutation.mutateAsync,
    isUpdatingNotificationPreferences:
      updateNotificationPreferencesMutation.isPending,
    refetchAlerts: alertsQuery.refetch,
  };
};
