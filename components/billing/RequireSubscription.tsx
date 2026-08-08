"use client";

import type { ReactNode } from "react";

import { useEntitlements } from "@/hooks/useEntitlements";

interface RequireSubscriptionProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequireSubscription = ({
  children,
  fallback,
}: RequireSubscriptionProps) => {
  const { isSubscribed, isPrivileged, isLoading } = useEntitlements();

  if (isLoading) {
    return null;
  }

  if (isSubscribed || isPrivileged) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Necesitas una suscripción activa para acceder a este contenido.
    </p>
  );
};
