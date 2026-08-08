"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/app/contexts/auth/useUser";
import { billingService } from "@/services/billingService";
import type { BillingMeEntitlementEntry } from "@/interfaces/billing.interface";

export const useEntitlements = () => {
  const { user, isAuthenticated } = useUser();

  const query = useQuery({
    queryKey: ["billing-me"],
    queryFn: () => billingService.getMe(),
    enabled: Boolean(isAuthenticated && user),
  });

  const entitlements = query.data?.entitlements ?? {};

  const has = (feature: string): boolean => {
    if (query.data?.source === "admin") {
      return true;
    }

    const entry = entitlements[feature];
    if (!entry) {
      return false;
    }

    if (entry.type === "boolean") {
      return entry.value === true;
    }

    if (entry.type === "unlimited" || entry.unlimited) {
      return true;
    }

    if (entry.type === "limit") {
      return entry.limit == null || entry.limit > 0;
    }

    return false;
  };

  const getLimit = (feature: string): number | null => {
    if (query.data?.source === "admin") {
      return null;
    }

    const entry: BillingMeEntitlementEntry | undefined = entitlements[feature];
    if (!entry) {
      return 0;
    }

    if (entry.type === "unlimited" || entry.unlimited) {
      return null;
    }

    return entry.limit ?? 0;
  };

  return {
    entitlements,
    billingMe: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    has,
    getLimit,
    refetch: query.refetch,
    planName: query.data?.subscription?.plan_name ?? null,
    isSubscribed: query.data?.subscription?.status === "active",
  };
};
