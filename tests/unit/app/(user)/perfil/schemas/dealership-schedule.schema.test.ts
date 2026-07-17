import { describe, expect, it } from "vitest";

import {
  buildEmptyScheduleFormValues,
  dealershipScheduleFormSchema,
  mapScheduleFormToPayload,
  mapSchedulesToFormValues,
} from "@/app/(user)/perfil/schemas/dealership-schedule.schema";

describe("dealershipScheduleFormSchema", () => {
  it("acepta 7 días con tramos válidos", () => {
    const values = buildEmptyScheduleFormValues();
    values.days[0] = {
      day: 1,
      is_open: true,
      open_times: [{ open_time: "09:00", close_time: "14:00" }],
    };

    const result = dealershipScheduleFormSchema.safeParse(values);
    expect(result.success).toBe(true);
  });

  it("rechaza cierre anterior o igual a apertura", () => {
    const values = buildEmptyScheduleFormValues();
    values.days[0] = {
      day: 1,
      is_open: true,
      open_times: [{ open_time: "14:00", close_time: "09:00" }],
    };

    const result = dealershipScheduleFormSchema.safeParse(values);
    expect(result.success).toBe(false);
  });

  it("rechaza tramos solapados", () => {
    const values = buildEmptyScheduleFormValues();
    values.days[0] = {
      day: 1,
      is_open: true,
      open_times: [
        { open_time: "09:00", close_time: "14:00" },
        { open_time: "13:00", close_time: "18:00" },
      ],
    };

    const result = dealershipScheduleFormSchema.safeParse(values);
    expect(result.success).toBe(false);
  });

  it("mapea formularios a payload con días cerrados vacíos", () => {
    const values = mapSchedulesToFormValues([
      {
        day: 1,
        open_times: [{ open_time: "09:00:00", close_time: "18:00:00" }],
      },
    ]);

    expect(values.days[0]).toEqual({
      day: 1,
      is_open: true,
      open_times: [{ open_time: "09:00", close_time: "18:00" }],
    });
    expect(values.days[1].is_open).toBe(false);

    const payload = mapScheduleFormToPayload(values);
    expect(payload.schedules[0].open_times).toEqual([
      { open_time: "09:00", close_time: "18:00" },
    ]);
    expect(payload.schedules[1].open_times).toEqual([]);
  });
});
