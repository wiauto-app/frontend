import { User } from "@/interfaces/user.interface";
import { ApiResponse, apiPut } from "@/lib/api";
import { UpdateProfileDto } from "@/validations/Schemas";

export const userService = {
  updateProfile: (data: UpdateProfileDto): Promise<ApiResponse<User>> =>
    apiPut<User>(`/auth/me`, data),
};
