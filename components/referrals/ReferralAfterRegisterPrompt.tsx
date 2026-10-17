"use client";

import { useEffect, useMemo, useState } from "react";
import { FRONTEND_URL } from "@/constants";
import { consumePostRegisterReferralCode } from "@/lib/referrals/referralStorage";
import { ReferralInviteDialog } from "./ReferralInviteDialog";

export const ReferralAfterRegisterPrompt = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const code = consumePostRegisterReferralCode();
    if (code) {
      setReferralCode(code);
    }
  }, []);

  const shareUrl = useMemo(() => {
    if (!referralCode) {
      return "";
    }

    const base = (FRONTEND_URL ?? "").replace(/\/$/, "");
    return `${base}/registro?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  if (!referralCode) {
    return null;
  }

  return (
    <ReferralInviteDialog
      open
      onOpenChange={(open) => {
        if (!open) {
          setReferralCode(null);
        }
      }}
      referralCode={referralCode}
      shareUrl={shareUrl}
    />
  );
};
