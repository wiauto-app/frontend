"use server";

import { cookies } from "next/headers";

import { cookiesConfig } from "@/config/cookies.config";
import {
  clearSessionFromCookieStore,
  resolveSessionRefresh,
  writeSessionTokensToCookieStore,
} from "@/lib/ensure-session.server";

export type RefreshSessionActionResult =
  | { ok: true; refreshed: boolean }
  | { ok: false; reason: "unauthorized" | "unavailable" };

export const refreshSessionAction =
  async (): Promise<RefreshSessionActionResult> => {
    const store = await cookies();
    const access_token =
      store.get(cookiesConfig.accessToken.name)?.value ?? null;
    const refresh_token =
      store.get(cookiesConfig.refreshToken.name)?.value ?? null;

    const result = await resolveSessionRefresh({ access_token, refresh_token });

    if (result.clearCookies) {
      clearSessionFromCookieStore(store);
      return { ok: false, reason: "unauthorized" };
    }

    if (result.status >= 500) {
      return { ok: false, reason: "unavailable" };
    }

    if (result.tokens) {
      writeSessionTokensToCookieStore(
        store,
        result.tokens.access_token,
        result.tokens.refresh_token_hash,
      );
    }

    return { ok: true, refreshed: result.refreshed };
  };
