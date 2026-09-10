"use client";

import {
  Bell,
  Mail,
  MessageCircleMore,
  MessageSquareText,
  Smartphone,
} from "lucide-react";
import type {
  Alert,
  AlertNotificationChannel,
  UpdateAlertPayload,
} from "@/interfaces/alert.interface";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type SavedSearchAlertTogglesProps = {
  alert: Alert;
  onUpdate: (payload: UpdateAlertPayload) => Promise<void>;
  isUpdating?: boolean;
};

const ALERT_TOGGLE_ITEMS = [
  {
    field: "notify_new_listings" as const,
    label: "Nuevos anuncios",
    description: "Vehículos nuevos que coinciden con tus filtros",
  },
  {
    field: "notify_price_drops" as const,
    label: "Bajadas de precio",
    description: "Cuando baja el precio de un anuncio coincidente",
  },
  {
    field: "notify_sold_removed" as const,
    label: "Vendidos o eliminados",
    description: "Cuando un anuncio coincidente se vende o deja de publicarse",
  },
  {
    field: "notify_featured" as const,
    label: "Destacados",
    description: "Cuando un anuncio coincidente pasa a estar destacado",
  },
  {
    field: "notify_recently_updated" as const,
    label: "Actualizados recientemente",
    description: "Cambios relevantes en anuncios que coinciden",
  },
] as const;

const CHANNEL_ITEMS: Array<{
  channel: AlertNotificationChannel;
  label: string;
  Icon: typeof Mail;
}> = [
  { channel: "email", label: "Correo electrónico", Icon: Mail },
  { channel: "push", label: "Notificación push", Icon: Bell },
  { channel: "sms", label: "SMS", Icon: Smartphone },
  { channel: "in_app", label: "Centro de notificaciones", Icon: MessageSquareText },
  { channel: "whatsapp", label: "WhatsApp", Icon: MessageCircleMore },
];

export const SavedSearchAlertToggles = ({
  alert,
  onUpdate,
  isUpdating = false,
}: SavedSearchAlertTogglesProps) => {
  const handleToggle = async (
    field: (typeof ALERT_TOGGLE_ITEMS)[number]["field"],
    checked: boolean,
  ) => {
    await onUpdate({ [field]: checked });
  };

  const handleActiveToggle = async (checked: boolean) => {
    await onUpdate({ is_active: checked });
  };

  const handleChannelToggle = async (channel: AlertNotificationChannel) => {
    const isEnabled = alert.notification_channels.includes(channel);
    await onUpdate({
      notification_channels: isEnabled
        ? alert.notification_channels.filter((value) => value !== channel)
        : [...alert.notification_channels, channel],
    });
  };

  return (
    <div className="space-y-4 border-t border-slate-100 pt-5">
      <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Alerta activa</p>
          <p className="mt-1 text-xs text-gray-500">
            Desactiva todas las notificaciones de esta búsqueda
          </p>
        </div>
        <Switch
          checked={alert.is_active}
          disabled={isUpdating}
          aria-label="Activar o desactivar alerta de esta búsqueda"
          onCheckedChange={(checked) => {
            void handleActiveToggle(checked);
          }}
        />
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-slate-950">Canales de entrega</p>
          <p className="mt-1 text-xs text-slate-500">
            Esta búsqueda se envía al instante por los canales seleccionados.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CHANNEL_ITEMS.map(({ channel, label, Icon }) => {
            const enabled = alert.notification_channels.includes(channel);
            return (
              <button
                key={channel}
                type="button"
                title={label}
                aria-label={`${enabled ? "Desactivar" : "Activar"} ${label}`}
                aria-pressed={enabled}
                disabled={isUpdating || !alert.is_active}
                onClick={() => {
                  void handleChannelToggle(channel);
                }}
                className={`inline-flex size-10 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                  enabled
                    ? "border-blue-100 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </div>

      {ALERT_TOGGLE_ITEMS.map((item) => (
        <div
          key={item.field}
          className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4"
        >
          <div className="min-w-0">
            <Label
              htmlFor={`${alert.id}-${item.field}`}
              className="text-sm font-semibold text-gray-900"
            >
              {item.label}
            </Label>
            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
          </div>
          <Switch
            id={`${alert.id}-${item.field}`}
            checked={alert[item.field]}
            disabled={isUpdating || !alert.is_active}
            aria-label={item.label}
            onCheckedChange={(checked) => {
              void handleToggle(item.field, checked);
            }}
          />
        </div>
      ))}
    </div>
  );
};
