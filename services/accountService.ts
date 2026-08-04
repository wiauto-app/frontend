import type { AccountSettings } from "@/interfaces/account.interface";
import type { UpdateEmailFormValues } from "@/app/(user)/perfil/schemas/update-email.schema";
import type { UpdatePasswordFormValues } from "@/app/(user)/perfil/schemas/update-password.schema";
import { ApiResponse, apiGet, apiPatch, fetchWithAuth } from "@/lib/api";

type ApiMessageResponse = {
  message: string;
  data: null;
};

const getResponseMessage = <T>(
  response: ApiResponse<T>,
  fallback: string,
): string => {
  if (response.message) {
    return response.message;
  }
  const nested = response.data as ApiMessageResponse | null;
  return nested?.message ?? fallback;
};

export const accountService = {
  getAccountSettings(): Promise<ApiResponse<AccountSettings>> {
    return apiGet<AccountSettings>("/auth/me/account");
  },

  updateEmail(
    payload: UpdateEmailFormValues,
  ): Promise<ApiResponse<ApiMessageResponse>> {
    return apiPatch<ApiMessageResponse>("/auth/me/email", payload);
  },

  updatePassword(
    payload: UpdatePasswordFormValues,
  ): Promise<ApiResponse<ApiMessageResponse>> {
    return apiPatch<ApiMessageResponse>("/auth/me/password", payload);
  },

  deleteAccount(): Promise<ApiResponse<ApiMessageResponse>> {
    return fetchWithAuth<ApiMessageResponse>("/auth/me", {
      method: "DELETE",
    });
  },

  getResponseMessage,
};
