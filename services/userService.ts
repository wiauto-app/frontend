import { UpdateProfilePayload } from "@/app/usuario/perfil/schemas/update-profile.schema";
import { User } from "@/interfaces/user.interface";
import { ApiResponse, apiPatch } from "@/lib/api";

export const userService = {
  updateProfile: (data: UpdateProfilePayload): Promise<ApiResponse<User>> =>
    apiPatch<User>(`/auth/me/profile`, data),
};
