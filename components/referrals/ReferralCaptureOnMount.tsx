"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { persistPendingReferralCode } from "@/lib/referrals/referralStorage";

export const ReferralCaptureOnMount = () => {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref")?.trim() ?? "";

  useEffect(() => {
    if (ref) {
      persistPendingReferralCode(ref);
    }
  }, [ref]);

  return null;
};
