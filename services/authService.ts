import { API_URL, FRONTEND_URL } from "@/constants";
import { User } from "@/interfaces/user.interface";
import { ApiResponse, apiGet, apiPost, fetchWithAuth } from "@/lib/api";
import {
  AuthResponseDto,
  Validate2faDto,
  ValidateBackupCodeDto,
  ResendEmailVerificationResponseDto,
} from "@/validations/auth";
import { LoginDto, RegisterDto, ResetPasswordDto, ContactDto } from "@/validations/Schemas";

export const authService = {

  login: (data: LoginDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/auth/login`, data),

  register: (data: RegisterDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/auth/register`, data),

  googleLogin: (opts?: { popup?: boolean }): string =>
    `${API_URL}/auth/google${opts?.popup ? "?popup=1" : ""}`,

  logout: (): Promise<ApiResponse<void>> =>
    apiGet<void>(`/auth/logout`),

  activate2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/activate`, data),

  disable2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/disable`, data),

  enable2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/enable`, data),

  getMe: async (accessToken?: string): Promise<ApiResponse<User | null>> => {
    if (!accessToken) {
      const isLoggedIn = await authService.isLoggedIn();
      if (!isLoggedIn) {
        return {
          ok: false,
          message: "No estás autenticado",
          status: 401,
          data: null,
        };
      }
    }

    return fetchWithAuth<User>("/auth/me", {
      method: "GET",
      skipAuthRefresh: true,
      credentials: "include",
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
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
  ): Promise<ApiResponse<ResendEmailVerificationResponseDto>> =>
    apiPost<ResendEmailVerificationResponseDto>(
      `/auth/password-recovery/request`,
      { email },
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

export const contactService = {
  contact: (data: ContactDto): Promise<ApiResponse<ResendEmailVerificationResponseDto>> =>
    apiPost<ResendEmailVerificationResponseDto>(
      `/contact`,
      data,
    ),
};
  
