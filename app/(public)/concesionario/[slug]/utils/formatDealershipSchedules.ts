import { DEALERSHIP_WEEK_DAYS } from "@/services/dealerships/constants/dealership-week-days";
import type { DealershipScheduleDay } from "@/services/dealerships/types/dealership.types";

const normalizeTimeToHhMm = (value: string): string => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) {
    return value;
  }
  return `${match[1].padStart(2, "0")}:${match[2]}`;
};

/** Convierte schedules API a texto legible para la ficha pública. */
export const formatDealershipSchedules = (
  schedules?: DealershipScheduleDay[],
): string | undefined => {
  if (!schedules?.length) {
    return undefined;
  }

  const byDay = new Map(schedules.map((schedule) => [schedule.day, schedule]));
  const hasAnyOpen = schedules.some(
    (schedule) => (schedule.open_times?.length ?? 0) > 0,
  );

  if (!hasAnyOpen) {
    return undefined;
  }

  return DEALERSHIP_WEEK_DAYS.map((weekDay) => {
    const openTimes = byDay.get(weekDay.id)?.open_times ?? [];
    if (openTimes.length === 0) {
      return `${weekDay.name}: Cerrado`;
    }

    const slots = openTimes
      .map(
        (slot) =>
          `${normalizeTimeToHhMm(slot.open_time)}–${normalizeTimeToHhMm(slot.close_time)}`,
      )
      .join(", ");

    return `${weekDay.name}: ${slots}`;
  }).join("\n");
};
