"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/app/contexts/auth/useUser";
import type { InAppNotification } from "@/interfaces/notification.interface";
import {
  ALERT_NOTIFICATIONS_INBOX_QUERY_KEY,
  alertService,
} from "@/services/alertService";
import type { PaginatedResult } from "@/types/general.types";

const NAVBAR_INBOX_PAGE = 1;
const NAVBAR_INBOX_LIMIT = 10;

export const NAVBAR_NOTIFICATIONS_QUERY_KEY = [
  ...ALERT_NOTIFICATIONS_INBOX_QUERY_KEY,
  NAVBAR_INBOX_PAGE,
  NAVBAR_INBOX_LIMIT,
] as const;

const getNotificationHref = (notification: InAppNotification): string => {
  const data = notification.data;
  if (!data) {
    return "/notificaciones";
  }

  if (typeof data.lead_id === "string" && data.lead_id.length > 0) {
    return "/contactos";
  }

  if (typeof data.vehicle_id === "string" && data.vehicle_id.length > 0) {
    return `/vehiculo/${data.vehicle_id}`;
  }

  return "/notificaciones";
};

export const useNavbarNotifications = () => {
  const { isAuthenticated } = useUser();
  const queryClient = useQueryClient();

  const inboxQuery = useQuery({
    queryKey: NAVBAR_NOTIFICATIONS_QUERY_KEY,
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await alertService.findNotifications({
        page: NAVBAR_INBOX_PAGE,
        limit: NAVBAR_INBOX_LIMIT,
      });
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar las notificaciones",
        );
      }
      return response.data;
    },
  });

  const invalidateInbox = async () => {
    await queryClient.invalidateQueries({
      queryKey: ALERT_NOTIFICATIONS_INBOX_QUERY_KEY,
    });
  };

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
        { queryKey: ALERT_NOTIFICATIONS_INBOX_QUERY_KEY },
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

  return {
    isAuthenticated,
    notifications,
    unreadCount,
    isLoading: inboxQuery.isLoading,
    isError: inboxQuery.isError,
    errorMessage:
      inboxQuery.error instanceof Error
        ? inboxQuery.error.message
        : "No se pudieron cargar las notificaciones",
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
    getNotificationHref,
    handleMarkRead: markReadMutation.mutateAsync,
    handleMarkAllRead: markAllReadMutation.mutateAsync,
  };
};
