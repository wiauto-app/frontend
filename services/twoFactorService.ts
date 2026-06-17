import type {
  TwoFactorActivateResponse,
  TwoFactorRegenerateResponse,
  TwoFactorSetupResponse,
} from "@/interfaces/account.interface";
import { ApiResponse, apiGet, apiPost } from "@/lib/api";

export const twoFactorService = {
  setup(): Promise<ApiResponse<TwoFactorSetupResponse>> {
    return apiGet<TwoFactorSetupResponse>("/2fa/setup");
  },

  activate(code: string): Promise<ApiResponse<TwoFactorActivateResponse>> {
    return apiPost<TwoFactorActivateResponse>("/2fa/activate", { code });
  },

  disable(code: string): Promise<ApiResponse<{ message: string }>> {
    return apiPost<{ message: string }>("/2fa/disable", { code });
  },

  regenerateBackupCodes(): Promise<ApiResponse<TwoFactorRegenerateResponse>> {
    return apiGet<TwoFactorRegenerateResponse>("/2fa/regenerate-backup-codes");
  },
};
