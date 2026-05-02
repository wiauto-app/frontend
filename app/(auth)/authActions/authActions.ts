"use server"

import { cookiesConfig } from "@/config/cookies.config";
import { authService } from "@/services/authService";
import { LoginDto } from "@/validations/Schemas";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(data: LoginDto) {
  try {
    const response = await authService.login(data);
    const cookiesStore = await cookies();
    cookiesStore.set(cookiesConfig.name, response.token, cookiesConfig.options);
    redirect("/");
  } catch (error) {
    throw error;
  }
}

export async function logoutAction() {
  const cookiesStore = await cookies();
  cookiesStore.delete(cookiesConfig.name);
  redirect("/iniciar-sesion");
}