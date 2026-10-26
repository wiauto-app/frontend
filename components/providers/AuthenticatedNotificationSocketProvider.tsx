"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { useUser } from "@/app/contexts/auth/useUser";

const NotificationSocketProvider = dynamic(
  () =>
    import("@/components/notifications/context/notificationSocketContext").then(
      (mod) => mod.NotificationSocketProvider,
    ),
  { ssr: false },
);

interface AuthenticatedNotificationSocketProviderProps {
  children: ReactNode;
}

export const AuthenticatedNotificationSocketProvider = ({
  children,
}: AuthenticatedNotificationSocketProviderProps) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return children;
  }

  return <NotificationSocketProvider>{children}</NotificationSocketProvider>;
};
