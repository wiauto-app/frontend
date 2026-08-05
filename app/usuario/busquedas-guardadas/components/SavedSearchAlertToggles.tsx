"use client";

import type { Alert, UpdateAlertPayload } from "@/interfaces/alert.interface";
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

  return (
    <div className="space-y-3 border-t border-gray-100 pt-4">
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
