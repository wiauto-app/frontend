import { User } from "@/interfaces/user.interface";
import { ApiResponse, apiPatch } from "@/lib/api";
import { UpdateProfileDto } from "@/validations/Schemas";

export const userService = {
  updateProfile: (data: UpdateProfileDto): Promise<ApiResponse<User>> =>
    apiPatch<User>(`/auth/me/profile`, data),
};
