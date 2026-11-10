"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { referralsService } from "@/services/referralsService";
import { ReferralInviteDialog } from "./ReferralInviteDialog";

interface SidebarReferralInviteProps {
  className?: string;
  onClick?: () => void;
}

export const SidebarReferralInvite = ({
  className,
  onClick,
}: SidebarReferralInviteProps) => {
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ["referrals", "me"],
    queryFn: async () => {
      const response = await referralsService.getMe();
      return response.ok ? response.data : null;
    },
    staleTime: 60_000,
  });

  if (!data?.referral_code || !data.share_url) {
    return null;
  }

  const handleOpen = () => {
    onClick?.();
    setOpen(true);
  };

  return (
    <>
      <button type="button" className={className} onClick={handleOpen}>
        <Gift className="size-4 shrink-0" aria-hidden />
        <p>Invitar y ganar un destacado</p>
      </button>
      <ReferralInviteDialog
        open={open}
        onOpenChange={setOpen}
        referralCode={data.referral_code}
        shareUrl={data.share_url}
      />
    </>
  );
};
