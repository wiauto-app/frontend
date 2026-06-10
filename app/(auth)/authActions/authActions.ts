"use server"

import { cookiesConfig } from "@/config/cookies.config";
import { authService } from "@/services/authService";
import { LoginDto } from "@/validations/Schemas";
import { cookies } from "next/headers";

export async function loginAction(data: LoginDto) {
  try {
    const response = await authService.login(data);
    if (!response.ok) {
      throw new Error(response.message || "Error al iniciar sesión");
    }
    const cookiesStore = await cookies();
    cookiesStore.set(cookiesConfig.accessToken.name, response.data.token, cookiesConfig.accessToken.options);
    const refresh_token =
      response.data.refresh_token ?? response.data.refreshToken_hash;
    if (!refresh_token) {
      throw new Error("No se recibió el token de actualización");
    }
    cookiesStore.set(cookiesConfig.refreshToken.name, refresh_token, cookiesConfig.refreshToken.options);
  } catch (error) {
    throw error;
  }
}

export async function logoutAction() {

  const cookiesStore = await cookies();
  cookiesStore.delete(cookiesConfig.accessToken.name);
  cookiesStore.delete(cookiesConfig.refreshToken.name);
 
}