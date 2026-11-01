"use client";

import { useEffect, useRef } from "react";
import { isRecentlyCreatedAccount } from "@/lib/analytics/publishFlowAuth";
import {
  clearPendingReferralCode,
  getPendingReferralCode,
} from "@/lib/referrals/referralStorage";
import { referralsService } from "@/services/referralsService";

interface UsePendingReferralAttributeOptions {
  enabled: boolean;
  accountCreatedAt?: string | null;
}

export const usePendingReferralAttribute = ({
  enabled,
  accountCreatedAt,
}: UsePendingReferralAttributeOptions) => {
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!enabled || hasAttempted.current) {
      return;
    }

    const code = getPendingReferralCode();
    if (!code) {
      return;
    }

    if (!isRecentlyCreatedAccount(accountCreatedAt)) {
      clearPendingReferralCode();
      hasAttempted.current = true;
      return;
    }

    hasAttempted.current = true;

    void referralsService
      .attribute(code)
      .then(() => {
        clearPendingReferralCode();
      })
      .catch(() => {
        hasAttempted.current = false;
      });
  }, [enabled, accountCreatedAt]);
};
