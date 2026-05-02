"use server"

import { userService } from "@/services/userService";
import { UpdateProfileDto } from "@/validations/Schemas";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: UpdateProfileDto) {
  try {
    const response = await userService.updateProfile(data);
    revalidatePath("/perfil"); // Refresh the page data
    return { success: true, data: response };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
