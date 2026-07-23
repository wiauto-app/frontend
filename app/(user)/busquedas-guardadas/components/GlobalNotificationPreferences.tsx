"use client";

import type { AlertNotificationPreferences } from "@/interfaces/alert-notification-preferences.interface";
import type { UpdateAlertNotificationPreferencesPayload } from "@/interfaces/alert-notification-preferences.interface";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface GlobalNotificationPreferencesProps {
  preferences: AlertNotificationPreferences;
  onUpdate: (payload: UpdateAlertNotificationPreferencesPayload) => Promise<void>;
  isUpdating?: boolean;
}

const GLOBAL_TOGGLE_ITEMS = [
  {
    field: "notify_new_matches" as const,
    label: "Nuevos anuncios que coinciden",
    description: "Te avisamos cuando aparezcan vehículos que encajen con tus búsquedas",
  },
  {
    field: "notify_price_drops" as const,
    label: "Bajadas de precio",
    description: "Cambios de precio en anuncios guardados o coincidentes",
  },
  {
    field: "notify_favorite_changes" as const,
    label: "Cambios en favoritos",
    description: "Actualizaciones en vehículos de tus listas",
  },
  {
    field: "notify_new_messages" as const,
    label: "Nuevos mensajes",
    description: "Cuando recibes un mensaje en el chat",
  },
  {
    field: "notify_seller_replies" as const,
    label: "Respuestas de vendedores",
    description: "Cuando un vendedor responde a tu consulta",
  },
  {
    field: "notify_saved_vehicle_reminders" as const,
    label: "Recordatorios de vehículos guardados",
    description: "Te recordamos revisar favoritos sin actividad reciente",
  },
  {
    field: "notify_new_leads" as const,
    label: "Nuevos contactos / leads",
    description: "Cuando alguien consulta o pide llamada en tus anuncios",
  },
] as const;

const FREQUENCY_OPTIONS = [
  { value: "instant" as const, label: "Al instante" },
  { value: "daily" as const, label: "Resumen diario" },
  { value: "weekly" as const, label: "Resumen semanal" },
];

const CHANNEL_ITEMS = [
  { field: "channel_email" as const, label: "Correo electrónico" },
  { field: "channel_push" as const, label: "Notificaciones push" },
  { field: "channel_in_app" as const, label: "In-app" },
  { field: "channel_sms" as const, label: "SMS" },
  { field: "channel_whatsapp" as const, label: "WhatsApp" },
] as const;

export const GlobalNotificationPreferences = ({
  preferences,
  onUpdate,
  isUpdating = false,
}: GlobalNotificationPreferencesProps) => {
  const handleToggle = async (
    field: (typeof GLOBAL_TOGGLE_ITEMS)[number]["field"],
    checked: boolean,
  ) => {
    await onUpdate({ [field]: checked });
  };

  const handleChannelToggle = async (
    field: (typeof CHANNEL_ITEMS)[number]["field"],
    checked: boolean,
  ) => {
    await onUpdate({ [field]: checked });
  };

  const handleFrequencyChange = async (
    frequency: (typeof FREQUENCY_OPTIONS)[number]["value"],
  ) => {
    await onUpdate({ frequency });
  };

  const handleReminderDaysChange = async (value: string) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 365) {
      return;
    }
    await onUpdate({ saved_vehicle_reminder_days: parsed });
  };

  return (
    <div className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Preferencias globales de notificación
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Configura cómo y cuándo quieres recibir alertas en toda tu cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {GLOBAL_TOGGLE_ITEMS.map((item) => (
          <div
            key={item.field}
            className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4"
          >
            <div className="min-w-0">
              <Label htmlFor={`global-${item.field}`} className="text-sm font-semibold text-gray-900">
                {item.label}
              </Label>
              <p className="mt-1 text-xs text-gray-500">{item.description}</p>
            </div>
            <Switch
              id={`global-${item.field}`}
              checked={preferences[item.field]}
              disabled={isUpdating}
              aria-label={item.label}
              onCheckedChange={(checked) => {
                void handleToggle(item.field, checked);
              }}
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-lg border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900">Frecuencia</p>
        <div className="flex flex-wrap gap-2">
          {FREQUENCY_OPTIONS.map((option) => (
            <ButtonFrequency
              key={option.value}
              label={option.label}
              isActive={preferences.frequency === option.value}
              disabled={isUpdating}
              onSelect={() => {
                void handleFrequencyChange(option.value);
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-900">Canales</p>
        <div className="space-y-3">
          {CHANNEL_ITEMS.map((item) => (
            <div key={item.field} className="flex items-center justify-between gap-4">
              <Label htmlFor={`channel-${item.field}`}>{item.label}</Label>
              <Switch
                id={`channel-${item.field}`}
                checked={preferences[item.field]}
                disabled={isUpdating}
                aria-label={item.label}
                onCheckedChange={(checked) => {
                  void handleChannelToggle(item.field, checked);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 p-4">
        <Label htmlFor="saved-vehicle-reminder-days" className="text-sm font-semibold text-gray-900">
          Recordar vehículos guardados después de (días)
        </Label>
        <Input
          id="saved-vehicle-reminder-days"
          type="number"
          min={1}
          max={365}
          className="mt-2 max-w-[160px]"
          defaultValue={preferences.saved_vehicle_reminder_days}
          disabled={isUpdating}
          onBlur={(event) => {
            void handleReminderDaysChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

type ButtonFrequencyProps = {
  label: string;
  isActive: boolean;
  disabled?: boolean;
  onSelect: () => void;
};

const ButtonFrequency = ({
  label,
  isActive,
  disabled = false,
  onSelect,
}: ButtonFrequencyProps) => (
  <button
    type="button"
    disabled={disabled}
    aria-pressed={isActive}
    onClick={onSelect}
    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "border-blue-600 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
    }`}
  >
    {label}
  </button>
);
