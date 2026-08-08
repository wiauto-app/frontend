"use client";

import type { ReactNode } from "react";

import { useEntitlements } from "@/hooks/useEntitlements";

interface RequireEntitlementProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const RequireEntitlement = ({
  feature,
  children,
  fallback,
}: RequireEntitlementProps) => {
  const { has, isPrivileged, isLoading } = useEntitlements();

  if (isLoading) {
    return null;
  }

  if (isPrivileged || has(feature)) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <p className="text-sm text-muted-foreground">
      No tienes acceso a esta función con tu plan actual.
    </p>
  );
};
