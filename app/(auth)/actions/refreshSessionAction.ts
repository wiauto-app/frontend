"use server";

import { cookies } from "next/headers";

import { cookiesConfig } from "@/config/cookies.config";
import {
  ensureValidSession,
  writeSessionTokensToCookieStore,
  clearSessionFromCookieStore,
} from "@/lib/ensure-session.server";

export type RefreshSessionActionResult =
  | { ok: true; refreshed: boolean }
  | { ok: false; reason: "unauthorized" };

export const refreshSessionAction =
  async (): Promise<RefreshSessionActionResult> => {
    const store = await cookies();
    const access_token = store.get(cookiesConfig.accessToken.name)?.value ?? null;
    const refresh_token = store.get(cookiesConfig.refreshToken.name)?.value;

    if (!refresh_token) {
      clearSessionFromCookieStore(store);
      return { ok: false, reason: "unauthorized" };
    }

    const result = await ensureValidSession({ refresh_token, access_token });

    if (result.outcome === "two_factor_pending") {
      return { ok: true, refreshed: false };
    }

    if (result.outcome === "session_refreshed") {
      writeSessionTokensToCookieStore(
        store,
        result.access_token,
        result.refresh_token_hash,
      );
      return { ok: true, refreshed: true };
    }

    if (result.outcome === "unauthorized") {
      clearSessionFromCookieStore(store);
      return { ok: false, reason: "unauthorized" };
    }

    return { ok: true, refreshed: false };
  };
