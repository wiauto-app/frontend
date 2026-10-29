// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { installMetaFbqStub } from "@/lib/analytics/loadMetaPixel";
import type { MetaFbqFunction } from "@/lib/analytics/window-globals";

const clearFbq = () => {
  delete window.fbq;
  delete window._fbq;
};

describe("installMetaFbqStub", () => {
  afterEach(() => {
    clearFbq();
  });

  it("encola las llamadas hasta que fbevents.js asigna callMethod", () => {
    installMetaFbqStub();

    const fbq = window.fbq as MetaFbqFunction;
    expect(fbq).toEqual(expect.any(Function));
    expect(fbq.push).toBe(fbq);
    expect(fbq.loaded).toBe(true);
    expect(fbq.version).toBe("2.0");

    fbq("init", "1234567890");
    fbq("track", "PageView");

    expect(fbq.callMethod).toBeUndefined();
    expect(fbq.queue).toHaveLength(2);
    expect(Array.from(fbq.queue?.[0] ?? [])).toEqual(["init", "1234567890"]);
    expect(Array.from(fbq.queue?.[1] ?? [])).toEqual(["track", "PageView"]);
  });

  it("despacha por callMethod cuando el SDK ya está cargado, sin volver a encolar", () => {
    installMetaFbqStub();

    const fbq = window.fbq as MetaFbqFunction;
    const callMethod = vi.fn();
    fbq.callMethod = callMethod;

    fbq("consent", "grant");
    fbq("track", "PageView", { path: "/" }, { eventID: "evt-1" });

    expect(fbq.queue).toHaveLength(0);
    expect(callMethod).toHaveBeenCalledTimes(2);
    expect(callMethod.mock.calls[0]).toEqual(["consent", "grant"]);
    expect(callMethod.mock.calls[1]).toEqual([
      "track",
      "PageView",
      { path: "/" },
      { eventID: "evt-1" },
    ]);
  });

  it("no sustituye un fbq ya instalado", () => {
    const existing = vi.fn() as unknown as MetaFbqFunction;
    window.fbq = existing;

    installMetaFbqStub();

    expect(window.fbq).toBe(existing);
  });
});
