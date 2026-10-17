"use server";

import { cookies } from "next/headers";
import { cookiesConfig } from "@/config/cookies.config";
import { isValidReturnPath } from "@/lib/auth/authReturnTo";

export const saveRedirectUrlAction = async (url: string) => {
  // Admite querystring (`/publicar?step=2&tasacion=…`), pero solo rutas relativas.
  if (!isValidReturnPath(url)) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(cookiesConfig.redirectUrl.name, url, cookiesConfig.redirectUrl.options);
};