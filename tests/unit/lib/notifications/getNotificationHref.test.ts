import { describe, expect, it } from "vitest";

import { getNotificationHref } from "@/lib/notifications/getNotificationHref";
import type { InAppNotification } from "@/interfaces/notification.interface";

const baseNotification = (
  overrides: Partial<InAppNotification> = {},
): InAppNotification => ({
  id: "n1",
  profile_id: "p1",
  category: "new_message",
  title: "Título",
  body: "Cuerpo",
  data: null,
  read_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("getNotificationHref", () => {
  it("prioriza el chat cuando hay chat_id y vehicle_id en mensajes", () => {
    const href = getNotificationHref(
      baseNotification({
        category: "new_message",
        data: {
          chat_id: "chat-abc",
          vehicle_id: "veh-123",
        },
      }),
    );

    expect(href).toBe("/usuario/mensajes?chat_id=chat-abc");
  });

  it("abre la ficha del vehículo en alertas sin chat_id", () => {
    const href = getNotificationHref(
      baseNotification({
        category: "price_drop",
        data: { vehicle_id: "veh-456" },
      }),
    );

    expect(href).toBe("/vehiculo/veh-456");
  });

  it("envía leads a contactos por categoría o lead_id", () => {
    expect(
      getNotificationHref(
        baseNotification({ category: "lead", data: {} }),
      ),
    ).toBe("/usuario/contactos");

    expect(
      getNotificationHref(
        baseNotification({
          category: "new_message",
          data: { lead_id: "lead-1", chat_id: "chat-x" },
        }),
      ),
    ).toBe("/usuario/contactos");
  });

  it("usa notificaciones como fallback sin data", () => {
    expect(getNotificationHref(baseNotification({ data: null }))).toBe(
      "/usuario/notificaciones",
    );
  });

  it("codifica chat_id en la query", () => {
    const href = getNotificationHref(
      baseNotification({
        category: "seller_reply",
        data: { chat_id: "id/with spaces" },
      }),
    );

    expect(href).toBe(
      "/usuario/mensajes?chat_id=id%2Fwith%20spaces",
    );
  });
});
