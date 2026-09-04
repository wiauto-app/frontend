import { UpdateProfilePayload } from "@/app/usuario/perfil/schemas/update-profile.schema";
import type { MyProfileResponse } from "@/interfaces/profile.interface";
import { ApiResponse, apiGet, apiPatch } from "@/lib/api";

export const userService = {
  getMyProfile: (): Promise<ApiResponse<MyProfileResponse>> =>
    apiGet<MyProfileResponse>(`/auth/me/profile`),

  updateProfile: (
    data: UpdateProfilePayload,
  ): Promise<ApiResponse<MyProfileResponse>> =>
    apiPatch<MyProfileResponse>(`/auth/me/profile`, data),
};
