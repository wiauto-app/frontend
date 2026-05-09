"use server"

import { userService } from "@/services/userService";
import { UpdateProfileDto } from "@/validations/Schemas";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: UpdateProfileDto) {
  try {
    const response = await userService.updateProfile(data);
    if (!response.ok) {
      throw new Error("Error al actualizar el perfil");
    }
    revalidatePath("/perfil");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
