import { API_URL, FRONTEND_URL } from "@/constants";
import { User } from "@/interfaces/user.interface";
import { VehicleList } from "@/interfaces/vehicle-list.interface";
import type { DealershipMembership } from "@/services/dealerships/types/team.types";
import {
  ApiResponse,
  apiGet,
  apiPost,
  buildApiUrl,
  fetchWithAuth,
} from "@/lib/api";
import {
  AuthResponseDto,
  GoogleOneTapDto,
  Validate2faDto,
  ValidateBackupCodeDto,
  ResendEmailVerificationResponseDto,
  TwoFactorChallengeState,
  VerifyTwoFactorLoginResponse,
} from "@/validations/auth";
import { LoginDto, RegisterDto, ResetPasswordDto } from "@/validations/Schemas";

export interface RegisterResult extends ApiResponse<User> {
  referral_code?: string;
  /** Anuncio creado como borrador; se publica al verificar el correo. */
  pending_vehicle_id?: string;
  /** El anuncio quedó encolado; el identificador llega al verificar el correo. */
  pending_vehicle_queued?: boolean;
  /** El registro fue bien, pero el anuncio no se pudo guardar. */
  pending_vehicle_error?: string;
}

/** Cuerpo interno de POST /auth/register tras el ResponseInterceptor del backend. */
interface RegisterApiPayload {
  message?: string;
  data?: User;
  referral_code?: string;
  pending_vehicle_id?: string;
  pending_vehicle_queued?: boolean;
  pending_vehicle_error?: string;
}

import { BillingMeResponse } from "@/interfaces/billing.interface";

export interface MeResponseDto extends User {
  vehicle_lists: VehicleList[];
  dealership_membership?: DealershipMembership | null;
  billing_summary: BillingMeResponse;
  province_id?: number | null;
}

export const authService = {

  login: (data: LoginDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/auth/login`, data),

  register: async (data: RegisterDto): Promise<RegisterResult> => {
    const response = await fetch(buildApiUrl("/auth/register"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = (await response.json()) as {
      ok?: boolean;
      status?: number;
      message?: string;
      data?: RegisterApiPayload | User;
    };

    const envelope =
      typeof body.data === "object" &&
      body.data !== null &&
      ("pending_vehicle_id" in body.data ||
        "pending_vehicle_queued" in body.data ||
        "pending_vehicle_error" in body.data ||
        "referral_code" in body.data ||
        ("data" in body.data && "message" in body.data))
        ? (body.data as RegisterApiPayload)
        : null;

    const user = envelope?.data ?? (body.data as User | undefined);
    const ok =
      typeof body.ok === "boolean" ? body.ok : response.ok;
    const status =
      typeof body.status === "number" ? body.status : response.status;

    return {
      ok,
      status,
      message:
        envelope?.message ?? body.message ?? response.statusText,
      data: user as User,
      referral_code: envelope?.referral_code,
      pending_vehicle_id: envelope?.pending_vehicle_id,
      pending_vehicle_queued: envelope?.pending_vehicle_queued,
      pending_vehicle_error: envelope?.pending_vehicle_error,
    };
  },

  googleLogin: (opts?: { popup?: boolean }): string =>
    `${API_URL}/auth/google${opts?.popup ? "?popup=1" : ""}`,

  googleOneTap: (
    data: GoogleOneTapDto,
  ): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/auth/google/one-tap`, data),

  logout: (): Promise<ApiResponse<void>> =>
    apiGet<void>(`/auth/logout`),

  activate2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/activate`, data),

  disable2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/disable`, data),

  enable2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/enable`, data),

  getMe: async (accessToken?: string): Promise<ApiResponse<MeResponseDto | null>> => {
    // if (!accessToken) {
    //   const isLoggedIn = await authService.isLoggedIn();
    //   if (!isLoggedIn) {
    //     return {
    //       ok: false,
    //       message: "No estás autenticado",
    //       status: 401,
    //       data: null,
    //     };
    //   }

    //   return fetchWithAuth<MeResponseDto>("/auth/me", {
    //     method: "GET",
    //     credentials: "include",
    //   });
    // }

    return fetchWithAuth<MeResponseDto>("/auth/me", {
      method: "GET",
      skipAuthRefresh: true,
      credentials: "include",
      // headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  validateBackupCode: (
    data: ValidateBackupCodeDto,
  ): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/validate-backup-code`, data),

  resendEmailVerification: (
    email: string,
  ): Promise<ApiResponse<ResendEmailVerificationResponseDto>> =>
    apiPost<ResendEmailVerificationResponseDto>(
      `/auth/email-verification/resend`,
      { email },
    ),

  forgotPassword: (
    email: string,
    redirect_url: string,
  ): Promise<ApiResponse<ResendEmailVerificationResponseDto>> =>
    apiPost<ResendEmailVerificationResponseDto>(
      `/auth/password-recovery/request`,
      { email, redirect_url },
    ),

  changePassword: (
    data: ResetPasswordDto,
  ): Promise<ApiResponse<ResendEmailVerificationResponseDto>> =>
    apiPost<ResendEmailVerificationResponseDto>(
      `/auth/password-recovery/change`,
      data,
    ),

  refreshToken: (): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/auth/refresh`, {}),

  getTwoFactorChallenge: (): Promise<ApiResponse<TwoFactorChallengeState>> =>
    fetchWithAuth<TwoFactorChallengeState>("/auth/two-factor/challenge", {
      skipAuthRefresh: true,
    }),

  verifyTwoFactorLogin: (
    code: string,
  ): Promise<ApiResponse<VerifyTwoFactorLoginResponse>> =>
    apiPost<VerifyTwoFactorLoginResponse>("/auth/verify-2fa", { code }),

  verifyBackupCodeLogin: (
    code: string,
  ): Promise<ApiResponse<VerifyTwoFactorLoginResponse>> =>
    apiPost<VerifyTwoFactorLoginResponse>("/auth/verify-backup-code", { code }),


  appleLogin: (opts?: { popup?: boolean }): string =>
    `${API_URL}/auth/apple${opts?.popup ? "?popup=1" : ""}`,

  isLoggedIn: async (accessToken?: string): Promise<boolean> => {
    const res = await fetch(`${FRONTEND_URL}/api/auth/isLoggedIn`, {
      credentials: "include",
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    })
    const data = await res.json()

    if (!res.ok) {
      console.error(data)
      return false
    }
    return data.isLoggedIn
  }

};
  
