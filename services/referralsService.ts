import { apiGet, apiPost, type ApiResponse } from "@/lib/api";

export interface ReferralMeResponse {
  referral_code: string;
  share_url: string;
  rewarded_count: number;
}

export const referralsService = {
  getMe: (): Promise<ApiResponse<ReferralMeResponse>> =>
    apiGet<ReferralMeResponse>("/v1/referrals/me"),

  attribute: (
    referral_code: string,
  ): Promise<ApiResponse<{ message: string }>> =>
    apiPost<{ message: string }>("/v1/referrals/attribute", {
      referral_code,
    }),
};
