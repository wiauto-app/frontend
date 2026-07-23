"use client";

import { useUser } from "@/app/contexts/auth/useUser";
import { getSocketBaseUrl } from "@/components/chat/utils/getSocketBaseUrl";
import { NOTIFICATION_SOCKET_EVENTS } from "@/components/notifications/constants/notificationSocketEvents";
import type { InAppNotification } from "@/interfaces/notification.interface";
import {
  ALERT_NOTIFICATIONS_INBOX_QUERY_KEY,
} from "@/services/alertService";
import type { PaginatedResult } from "@/types/general.types";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

interface NotificationSocketContextValue {
  isConnected: boolean;
}

const NotificationSocketContext =
  createContext<NotificationSocketContextValue | null>(null);

const prependNotificationToInboxCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  notification: InAppNotification,
) => {
  queryClient.setQueriesData<PaginatedResult<InAppNotification>>(
    { queryKey: ALERT_NOTIFICATIONS_INBOX_QUERY_KEY },
    (previous) => {
      if (!previous) {
        return {
          data: [notification],
          total: 1,
          page: 1,
          limit: 30,
        };
      }

      const exists = previous.data.some((item) => item.id === notification.id);
      if (exists) {
        return previous;
      }

      return {
        ...previous,
        data: [notification, ...previous.data],
        total: previous.total + 1,
      };
    },
  );
};

export const NotificationSocketProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user, isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return;
    }

    const socket: Socket = io(`${getSocketBaseUrl()}/notifications`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleNotificationNew = (notification: InAppNotification) => {
      prependNotificationToInboxCache(queryClient, notification);
      void queryClient.invalidateQueries({
        queryKey: ALERT_NOTIFICATIONS_INBOX_QUERY_KEY,
      });
      toast.message(notification.title, {
        description: notification.body,
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(
      NOTIFICATION_SOCKET_EVENTS.NOTIFICATION_NEW,
      handleNotificationNew,
    );

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(
        NOTIFICATION_SOCKET_EVENTS.NOTIFICATION_NEW,
        handleNotificationNew,
      );
      socket.disconnect();
      setIsConnected(false);
    };
  }, [isAuthenticated, user?.id, queryClient]);

  return (
    <NotificationSocketContext.Provider value={{ isConnected }}>
      {children}
    </NotificationSocketContext.Provider>
  );
};

export const useNotificationSocket = (): NotificationSocketContextValue => {
  const context = useContext(NotificationSocketContext);
  if (!context) {
    throw new Error(
      "useNotificationSocket debe usarse dentro de NotificationSocketProvider.",
    );
  }
  return context;
};
