"use client";

import { useQuery } from "@tanstack/react-query";
import { ReferralInviteCard } from "./ReferralInviteCard";
import { referralsService } from "@/services/referralsService";

export const MyListingsReferralCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["referrals", "me"],
    queryFn: async () => {
      const response = await referralsService.getMe();
      return response.ok ? response.data : null;
    },
    staleTime: 60_000,
  });

  if (isLoading || !data?.referral_code) {
    return null;
  }

  return (
    <ReferralInviteCard
      referralCode={data.referral_code}
      shareUrl={data.share_url}
      rewardedCount={data.rewarded_count}
    />
  );
};
