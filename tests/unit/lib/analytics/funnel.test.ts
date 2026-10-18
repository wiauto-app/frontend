import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  newEventId,
  resetPublishFunnel,
  track,
} from "@/lib/analytics/funnel";

describe("funnel.track", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      dataLayer: [],
      fbq: vi.fn(),
      location: { href: "http://localhost/publicar", search: "" },
    });
    vi.stubGlobal("document", {
      cookie: 'wiauto_consent={"version":1,"analytics":true,"marketing":true}',
    });
    vi.stubGlobal("sessionStorage", {
      store: new Map<string, string>(),
      getItem(key: string) {
        return this.store.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        this.store.set(key, value);
      },
      removeItem(key: string) {
        this.store.delete(key);
      },
    });
    vi.stubGlobal("crypto", {
      randomUUID: () => "test-event-id",
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("empuja al dataLayer con event_id", () => {
    const eventId = track("publicar_click", { source: "header" });
    expect(eventId).toBe("test-event-id");
    expect(window.dataLayer).toEqual([
      {
        event: "publicar_click",
        event_id: "test-event-id",
        source: "header",
      },
    ]);
  });

  it("no repite eventos de una vez por sesión", () => {
    track("publicar_inicio", { entry: "organic" });
    track("publicar_inicio", { entry: "organic" });
    expect(window.dataLayer).toHaveLength(1);
  });

  it("resetPublishFunnel limpia los flags once", () => {
    track("publicar_inicio", { entry: "organic" });
    resetPublishFunnel();
    track("publicar_inicio", { entry: "ads" });
    expect(window.dataLayer).toHaveLength(2);
  });

  it("newEventId genera un uuid", () => {
    expect(newEventId()).toBe("test-event-id");
  });
});
