import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

export const formatMessageTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (isToday(date)) {
    return format(date, "HH:mm", { locale: es });
  }
  if (isYesterday(date)) {
    return `Ayer ${format(date, "HH:mm", { locale: es })}`;
  }
  return format(date, "d MMM HH:mm", { locale: es });
};

export const formatListMessageTime = (isoDate: string | null): string => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (isToday(date)) {
    return format(date, "HH:mm", { locale: es });
  }
  if (isYesterday(date)) {
    return "Ayer";
  }
  return format(date, "d MMM", { locale: es });
};
