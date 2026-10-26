"use client";

import type { ReactNode } from "react";

import { NotificationSocketProvider } from "@/components/notifications/context/notificationSocketContext";

interface AuthenticatedNotificationSocketProviderProps {
  children: ReactNode;
}

/**
 * Mantiene un único árbol de providers: al envolver solo tras `isAuthenticated`
 * se remontaba todo el layout (flash en blanco al recargar con sesión).
 * La conexión socket se carga en lazy dentro del provider.
 */
export const AuthenticatedNotificationSocketProvider = ({
  children,
}: AuthenticatedNotificationSocketProviderProps) => {
  return <NotificationSocketProvider>{children}</NotificationSocketProvider>;
};
