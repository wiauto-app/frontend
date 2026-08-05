"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { UpdateAlertNotificationPreferencesPayload } from "@/interfaces/alert-notification-preferences.interface";
import type { InAppNotification } from "@/interfaces/notification.interface";
import {
  ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY,
  ALERT_NOTIFICATIONS_QUERY_KEY,
  alertService,
} from "@/services/alertService";
import type { PaginatedResult } from "@/types/general.types";

const DEFAULT_LIMIT = 30;

export const useNotificacionesPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const preferencesQuery = useQuery({
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

  const inboxQuery = useQuery({
    queryKey: [...ALERT_NOTIFICATIONS_QUERY_KEY, page, DEFAULT_LIMIT],
    queryFn: async () => {
      const response = await alertService.findNotifications({
        page,
        limit: DEFAULT_LIMIT,
      });
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar las notificaciones",
        );
      }
      return response.data;
    },
  });

  const invalidatePreferences = async () => {
    await queryClient.invalidateQueries({
      queryKey: ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY,
    });
  };

  const invalidateInbox = async () => {
    await queryClient.invalidateQueries({
      queryKey: ALERT_NOTIFICATIONS_QUERY_KEY,
    });
  };

  const updatePreferencesMutation = useMutation({
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
    onSuccess: async (data) => {
      queryClient.setQueryData(ALERT_NOTIFICATION_PREFERENCES_QUERY_KEY, data);
      await invalidatePreferences();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar las preferencias",
      );
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await alertService.markNotificationRead(notificationId);
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo marcar la notificación como leída",
        );
      }
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueriesData<PaginatedResult<InAppNotification>>(
        { queryKey: ALERT_NOTIFICATIONS_QUERY_KEY },
        (previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            data: previous.data.map((item) =>
              item.id === updated.id ? updated : item,
            ),
          };
        },
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo marcar como leída",
      );
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const response = await alertService.markAllNotificationsRead();
      if (!response.ok) {
        throw new Error(
          response.message || "No se pudieron marcar todas como leídas",
        );
      }
      return response.data;
    },
    onSuccess: async () => {
      await invalidateInbox();
      toast.success("Todas las notificaciones se marcaron como leídas");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudieron marcar todas como leídas",
      );
    },
  });

  const notifications = inboxQuery.data?.data ?? [];
  const unreadCount = notifications.filter((item) => !item.read_at).length;
  const total = inboxQuery.data?.total ?? 0;
  const limit = inboxQuery.data?.limit ?? DEFAULT_LIMIT;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    preferences: preferencesQuery.data ?? null,
    notifications,
    unreadCount,
    isLoadingPreferences: preferencesQuery.isLoading,
    isLoadingInbox: inboxQuery.isLoading,
    preferencesError: preferencesQuery.error,
    inboxError: inboxQuery.error,
    page,
    total,
    totalPages,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
    handlePageChange: setPage,
    handleUpdatePreferences: updatePreferencesMutation.mutateAsync,
    handleMarkRead: markReadMutation.mutateAsync,
    handleMarkAllRead: markAllReadMutation.mutateAsync,
  };
};
