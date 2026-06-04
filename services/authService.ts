import { API_URL } from "@/constants";
import { User } from "@/interfaces/user.interface";
import { ApiResponse, apiGet, apiPost, fetchWithAuth } from "@/lib/api";
import {
  AuthResponseDto,
  GoogleLoginDto,
  Validate2faDto,
  ValidateBackupCodeDto,
  ResendEmailVerificationResponseDto,
} from "@/validations/auth";
import { LoginDto, RegisterDto, ResetPasswordDto } from "@/validations/Schemas";

export const authService = {

  login: (data: LoginDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/auth/login`, data),

  register: (data: RegisterDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/auth/register`, data),

  googleLogin: (): string =>
    `${API_URL}/auth/google`,

  logout: (): Promise<ApiResponse<void>> =>
    apiGet<void>(`/auth/logout`),

  activate2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/activate`, data),

  disable2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/disable`, data),

  enable2fa: (data: Validate2faDto): Promise<ApiResponse<AuthResponseDto>> =>
    apiPost<AuthResponseDto>(`/2fa/enable`, data),

  getMe: async (accessToken?: string): Promise<ApiResponse<User>> => {
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


  appleLogin: (): string =>
    `${API_URL}/auth/apple`,
};
