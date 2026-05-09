"use server"

import { cookiesConfig } from "@/config/cookies.config";
import { authService } from "@/services/authService";
import { LoginDto } from "@/validations/Schemas";
import { cookies } from "next/headers";

export async function loginAction(data: LoginDto) {
  try {
    const response = await authService.login(data);
    if (!response.ok) {
      throw new Error("Email o contraseña incorrectos");
    }
    const cookiesStore = await cookies();
    cookiesStore.set(cookiesConfig.name, response.data.token, cookiesConfig.options);
    cookiesStore.set(cookiesConfig.refreshTokenName, response.data.refreshToken_hash, cookiesConfig.options);
  } catch (error) {
    throw error;
  }
}

export async function logoutAction() {

  const cookiesStore = await cookies();
  cookiesStore.delete(cookiesConfig.name);
  cookiesStore.delete(cookiesConfig.refreshTokenName);
 
}