"use client";

import { useEffect, useRef } from "react";
import {
  clearPendingReferralCode,
  getPendingReferralCode,
} from "@/lib/referrals/referralStorage";
import { referralsService } from "@/services/referralsService";

interface UsePendingReferralAttributeOptions {
  enabled: boolean;
}

export const usePendingReferralAttribute = ({
  enabled,
}: UsePendingReferralAttributeOptions) => {
  const has_attempted = useRef(false);

  useEffect(() => {
    if (!enabled || has_attempted.current) {
      return;
    }

    const code = getPendingReferralCode();
    if (!code) {
      return;
    }

    has_attempted.current = true;

    void referralsService
      .attribute(code)
      .then(() => {
        clearPendingReferralCode();
      })
      .catch(() => {
        has_attempted.current = false;
      });
  }, [enabled]);
};
