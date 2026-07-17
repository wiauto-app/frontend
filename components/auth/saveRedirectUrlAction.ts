"use server";

import { cookies } from "next/headers";
import { cookiesConfig } from "@/config/cookies.config";

export const saveRedirectUrlAction = async (url: string) => {
  const cookieStore = await cookies();
  cookieStore.set(cookiesConfig.redirectUrl.name, url, cookiesConfig.redirectUrl.options);
};