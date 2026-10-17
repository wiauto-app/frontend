import { describe, expect, it } from "vitest";

import {
  PLAY_STORE_URL,
  resolveAppStoreTarget,
  isNativeWiautoApp,
} from "@/lib/app-stores";

describe("resolveAppStoreTarget", () => {
  it("envía iPhone a la App Store", () => {
    const target = resolveAppStoreTarget(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    );
    expect(target.kind).toBe("app_store");
    expect(target.storeName).toBe("App Store");
  });

  it("envía Mac a la App Store", () => {
    const target = resolveAppStoreTarget(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    );
    expect(target.kind).toBe("app_store");
  });

  it("envía Android a Google Play", () => {
    const target = resolveAppStoreTarget(
      "Mozilla/5.0 (Linux; Android 14; Pixel 8)",
    );
    expect(target.kind).toBe("play_store");
    expect(target.href).toBe(PLAY_STORE_URL);
  });

  it("envía Windows a Google Play", () => {
    const target = resolveAppStoreTarget("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    expect(target.kind).toBe("play_store");
  });
});

describe("isNativeWiautoApp", () => {
  it("detecta el esquema de la app nativa", () => {
    expect(isNativeWiautoApp("wiauto/1.0.0 expo/54")).toBe(true);
    expect(isNativeWiautoApp("Mozilla/5.0 (iPhone)")).toBe(false);
  });
});
