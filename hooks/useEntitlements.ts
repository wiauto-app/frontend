"use client";

import { useUser } from "@/app/contexts/auth/useUser";
import type { BillingMeEntitlementEntry } from "@/interfaces/billing.interface";
import { resolveLimitUsage } from "@/lib/billing/entitlements";

export const useEntitlements = () => {
  const { user } = useUser();
  const billingSummary = user?.billing_summary;
  const entitlements = user?.billing_summary?.entitlements ?? {};
  const isPrivileged =
    user?.billing_summary?.source === "admin" || user?.isAdmin === true;
  const isSubscribed = !!billingSummary?.plan_name
  const has = (feature: string): boolean => {
    if (isPrivileged) {
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
    if (isPrivileged) {
      return null;
    }

    const entry: BillingMeEntitlementEntry | undefined = entitlements[feature];
    if (!entry) {
      return 0;
    }

    if (entry.type === "unlimited" || entry.unlimited) {
      return null;
    }

    if (entry.type === "boolean") {
      return entry.value === true ? 1 : 0;
    }

    return entry.limit ?? 0;
  };

  const getUsed = (feature: string): number => {
    const entry = entitlements[feature];
    return entry?.used ?? 0;
  };

  const getRemaining = (feature: string): number | null => {
    const snapshot = resolveLimitUsage(entitlements[feature], { isPrivileged });
    return snapshot.remaining;
  };

  const getLimitUsage = (feature: string) =>
    resolveLimitUsage(entitlements[feature], { isPrivileged });

  return {
    entitlements,
    billingSummary,
    has,
    getLimit,
    getUsed,
    getRemaining,
    getLimitUsage,
    planName: billingSummary?.plan_name ?? null,
    isSubscribed,
    isPrivileged,
  };
};
