import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CONSENT_COOKIE_NAME, CONSENT_VERSION } from "@/lib/analytics/consent";
import {
  getMetaCookies,
  getPublishFunnelContext,
  newEventId,
  peekVehicleDataEventId,
  resetPublishFunnel,
  track,
  trackPublishAuthView,
  trackPublishSubmitClick,
  trackPublishValidationError,
} from "@/lib/analytics/funnel";

interface MemoryStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const createMemoryStorage = (): MemoryStorage => {
  const store = new Map<string, string>();

  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

const setConsent = (marketing: boolean) => {
  const payload = encodeURIComponent(
    JSON.stringify({
      analytics: true,
      marketing,
      version: CONSENT_VERSION,
      decidedAt: "2026-10-18T00:00:00.000Z",
    }),
  );
  document.cookie = `${CONSENT_COOKIE_NAME}=${payload}`;
};

describe("funnel", () => {
  const fbq = vi.fn();
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = createMemoryStorage();
    fbq.mockReset();
    vi.stubGlobal("sessionStorage", storage);
    vi.stubGlobal("document", {
      cookie: "",
    });
    vi.stubGlobal("window", {
      dataLayer: [] as Record<string, unknown>[],
      fbq,
      location: {
        href: "https://wiauto.test/publicar",
        search: "",
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("empuja siempre al dataLayer y no llama a fbq sin consentimiento de marketing", () => {
    const eventId = track("publicar_click", { source: "header" }, "evt-1");

    expect(eventId).toBe("evt-1");
    expect(window.dataLayer).toEqual([
      { event: "publicar_click", event_id: "evt-1", source: "header" },
    ]);
    expect(fbq).not.toHaveBeenCalled();
  });

  it("envía eventos custom a Meta solo con marketing y login no sale del dataLayer", () => {
    setConsent(true);

    track("publicar_inicio", { entry: "ads" }, "inicio-1");
    track("login", { method: "email", new_user: false }, "login-1");

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith(
      "trackCustom",
      "PublicarInicio",
      { entry: "ads" },
      { eventID: "inicio-1" },
    );
    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ event: "login", event_id: "login-1" }),
      ]),
    );
  });

  it("traduce sign_up de usuario nuevo a CompleteRegistration", () => {
    setConsent(true);

    track("sign_up", { method: "google", new_user: true }, "reg-1");

    expect(fbq).toHaveBeenCalledWith(
      "track",
      "CompleteRegistration",
      { method: "google", new_user: true },
      { eventID: "reg-1" },
    );
  });

  it("no reenvía a Meta un sign_up que no es usuario nuevo", () => {
    setConsent(true);

    track("sign_up", { method: "email", new_user: false }, "reg-2");

    expect(fbq).not.toHaveBeenCalled();
    expect(window.dataLayer[0]).toMatchObject({ event: "sign_up" });
  });

  it("dispara una sola vez por sesión los eventos del wizard y permite repetir tras reset", () => {
    track("publicar_fotos", { photo_count: 3 }, "fotos-1");
    track("publicar_fotos", { photo_count: 4 }, "fotos-2");

    expect(window.dataLayer).toHaveLength(1);

    resetPublishFunnel();
    track("publicar_fotos", { photo_count: 3 }, "fotos-3");

    expect(window.dataLayer).toHaveLength(2);
    expect(window.dataLayer[1]).toMatchObject({ event_id: "fotos-3" });
  });

  it("guarda el event id de publicar_datos, normaliza el precio y omite email", () => {
    track(
      "publicar_datos",
      {
        brand: "Seat",
        model: "Ibiza",
        year: 2020,
        price: "9500",
        currency: "EUR",
        email: "ana@example.com",
      },
      "datos-1",
    );

    expect(peekVehicleDataEventId()).toBe("datos-1");
    expect(getPublishFunnelContext()).toEqual({
      brand: "Seat",
      model: "Ibiza",
      year: 2020,
    });
    expect(window.dataLayer[0]).toMatchObject({
      price: 9500,
      currency: "EUR",
      brand: "Seat",
    });
    expect(window.dataLayer[0]).not.toHaveProperty("email");
  });

  it("lee cookies de Meta y fabrica fbc desde fbclid", () => {
    document.cookie = "_fbp=fb.1.1.pixel";
    window.location.search = "?fbclid=click-1";

    expect(getMetaCookies()).toEqual({
      fbp: "fb.1.1.pixel",
      fbc: expect.stringMatching(/^fb\.1\.\d+\.click-1$/),
    });
  });

  it("genera un event id", () => {
    expect(newEventId().length).toBeGreaterThan(8);
  });

  it("envía clic en publicar, error de validación y llegada al login", () => {
    setConsent(true);

    trackPublishSubmitClick({ step: "Contacto y publicar" });
    trackPublishValidationError({
      field: "price",
      step: "Coche",
      trigger: "siguiente",
    });
    trackPublishAuthView("registro");

    expect(window.dataLayer).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "publicar_submit_click",
          step: "Contacto y publicar",
        }),
        expect.objectContaining({
          event: "publicar_error_validacion",
          field: "price",
          step: "Coche",
          trigger: "siguiente",
        }),
        expect.objectContaining({
          event: "publicar_auth_view",
          mode: "registro",
        }),
      ]),
    );
    expect(fbq).toHaveBeenCalledWith(
      "trackCustom",
      "PublicarSubmitClick",
      { step: "Contacto y publicar" },
      expect.objectContaining({ eventID: expect.any(String) }),
    );
    expect(fbq).toHaveBeenCalledWith(
      "trackCustom",
      "PublicarErrorValidacion",
      { field: "price", step: "Coche", trigger: "siguiente" },
      expect.objectContaining({ eventID: expect.any(String) }),
    );
    expect(fbq).toHaveBeenCalledWith(
      "trackCustom",
      "PublicarAuthView",
      { mode: "registro" },
      expect.objectContaining({ eventID: expect.any(String) }),
    );
  });
});
