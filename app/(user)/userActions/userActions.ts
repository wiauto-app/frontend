"use server"

import { API_URL } from "@/constants";
import { UpdateProfileDto } from "@/validations/Schemas";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateProfileAction(data: UpdateProfileDto) {
  const token = (await cookies()).get("access_token")?.value;

  const response = await fetch(`${API_URL}/auth/me/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let message = "Error al actualizar el perfil";
    try {
      const parsed = JSON.parse(errorBody);
      message = parsed.message || message;
    } catch {}
    throw new Error(message);
  }

  revalidatePath("/perfil");
  const json = await response.json();
  return { success: true, data: json.data };
}
