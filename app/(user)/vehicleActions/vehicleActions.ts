"use server"

import { API_URL } from "@/constants";
import { CreateVehicleDto, UpdateVehicleDto } from "@/interfaces/vehicle.interface";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function handleResponse(response: Response, defaultMessage: string) {
  if (!response.ok) {
    const errorBody = await response.text();
    let message = defaultMessage;
    try {
      const parsed = JSON.parse(errorBody);
      message = parsed.message || message;
    } catch {}
    throw new Error(message);
  }
  return response.json();
}

export async function createVehicleAction(
  data: CreateVehicleDto,
  files: File[],
) {
  const token = (await cookies()).get("access_token")?.value;

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_URL}/v1/vehicles`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data_1 = await handleResponse(response, "Error al publicar el vehículo");
  revalidatePath("/perfil");
  return { success: true, data: data_1 };
}

export async function updateVehicleAction(id: string, data: UpdateVehicleDto) {
  const token = (await cookies()).get("access_token")?.value;

  const response = await fetch(`${API_URL}/v1/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const data_1 = await handleResponse(response, "Error al actualizar el vehículo");
  revalidatePath("/perfil");
  return { success: true, data: data_1 };
}
