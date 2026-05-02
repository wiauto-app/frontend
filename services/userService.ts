import { User } from "@/interfaces/user.interface";
import { apiPut } from "@/lib/api";
import { UpdateProfileDto } from "@/validations/Schemas";

export const userService = {
  updateProfile: (data: UpdateProfileDto): Promise<User> =>
    apiPut<User>(`/auth/me`, data)}
