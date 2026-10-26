import { z } from "zod";

import { DEALERSHIP_WEEK_DAYS } from "@/services/dealerships/constants/dealership-week-days";
import type {
  DealershipScheduleDay,
  UpdateDealershipSchedulesPayload,
} from "@/services/dealerships/types/dealership.types";

const TIME_HH_MM = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeToMinutes = (value: string): number => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const openTimeSlotSchema = z
  .object({
    open_time: z
      .string()
      .regex(TIME_HH_MM, "Usa el formato HH:mm"),
    close_time: z
      .string()
      .regex(TIME_HH_MM, "Usa el formato HH:mm"),
  })
  .superRefine((slot, ctx) => {
    if (timeToMinutes(slot.close_time) <= timeToMinutes(slot.open_time)) {
      ctx.addIssue({
        code: "custom",
        message: "La hora de cierre debe ser posterior a la de apertura",
        path: ["close_time"],
      });
    }
  });

const scheduleDaySchema = z
  .object({
    day: z.number().int().min(1).max(7),
    is_open: z.boolean(),
    open_times: z.array(openTimeSlotSchema),
  })
  .superRefine((day, ctx) => {
    if (!day.is_open) {
      return;
    }

    if (day.open_times.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Añade al menos un tramo o marca el día como cerrado",
        path: ["open_times"],
      });
      return;
    }

    const sorted = [...day.open_times].sort(
      (a, b) => timeToMinutes(a.open_time) - timeToMinutes(b.open_time),
    );

    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];
      if (timeToMinutes(current.open_time) < timeToMinutes(previous.close_time)) {
        ctx.addIssue({
          code: "custom",
          message: "Los tramos del mismo día no pueden solaparse",
          path: ["open_times"],
        });
        return;
      }
    }
  });

export const dealershipScheduleFormSchema = z.object({
  days: z.array(scheduleDaySchema).length(7),
});

export type DealershipScheduleFormValues = z.infer<
  typeof dealershipScheduleFormSchema
>;

export const DEFAULT_OPEN_SLOT = {
  open_time: "09:00",
  close_time: "18:00",
} as const;

const normalizeTimeToHhMm = (value: string): string => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return value;
  }
  const hours = match[1].padStart(2, "0");
  const minutes = match[2];
  return `${hours}:${minutes}`;
};

export const buildEmptyScheduleFormValues =
  (): DealershipScheduleFormValues => ({
    days: DEALERSHIP_WEEK_DAYS.map((weekDay) => ({
      day: weekDay.id,
      is_open: false,
      open_times: [],
    })),
  });

export const mapSchedulesToFormValues = (
  schedules?: DealershipScheduleDay[],
): DealershipScheduleFormValues => {
  const byDay = new Map(
    (schedules ?? []).map((schedule) => [schedule.day, schedule]),
  );

  return {
    days: DEALERSHIP_WEEK_DAYS.map((weekDay) => {
      const schedule = byDay.get(weekDay.id);
      const open_times = (schedule?.open_times ?? []).map((slot) => ({
        open_time: normalizeTimeToHhMm(slot.open_time),
        close_time: normalizeTimeToHhMm(slot.close_time),
      }));

      return {
        day: weekDay.id,
        is_open: open_times.length > 0,
        open_times,
      };
    }),
  };
};

export const mapScheduleFormToPayload = (
  values: DealershipScheduleFormValues,
): UpdateDealershipSchedulesPayload => ({
  schedules: values.days.map((day) => ({
    day: day.day,
    open_times: day.is_open
      ? day.open_times.map((slot) => ({
          open_time: slot.open_time,
          close_time: slot.close_time,
        }))
      : [],
  })),
});
