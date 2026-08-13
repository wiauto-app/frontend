"use client";


import { useUser } from "@/app/contexts/auth/useUser";
import type { BillingMeEntitlementEntry } from "@/interfaces/billing.interface";

export const useEntitlements = () => {
  const { user } = useUser();
  const billingSummary = user?.billing_summary;

  const entitlements = user?.billing_summary?.entitlements ?? {};
  const isPrivileged =
    user?.billing_summary?.source === "admin" || user?.isAdmin === true;
  const isSubscribed = billingSummary?.subscription?.status === "active";

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

    return entry.limit ?? 0;
  };

  return {
    entitlements,
    billingSummary,
    has,
    getLimit,
    planName: billingSummary?.subscription?.plan_name ?? null,
    isSubscribed,
    isPrivileged,
  };
};
