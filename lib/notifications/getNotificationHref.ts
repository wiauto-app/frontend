import type { InAppNotification } from "@/interfaces/notification.interface";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const buildMessagesHref = (chatId: string): string =>
  `/usuario/mensajes?chat_id=${encodeURIComponent(chatId)}`;

export const getNotificationHref = (notification: InAppNotification): string => {
  const data = notification.data;

  if (!data) {
    return "/usuario/notificaciones";
  }

  if (
    notification.category === "lead" ||
    isNonEmptyString(data.lead_id)
  ) {
    return "/usuario/contactos";
  }

  if (isNonEmptyString(data.chat_id)) {
    return buildMessagesHref(data.chat_id);
  }

  if (isNonEmptyString(data.vehicle_id)) {
    return `/vehiculo/${data.vehicle_id}`;
  }

  return "/usuario/notificaciones";
};
