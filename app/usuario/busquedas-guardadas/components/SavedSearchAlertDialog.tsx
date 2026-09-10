"use client";

import {
  BellRing,
  LayoutPanelTop,
  Mail,
  MessageCircleMore,
  MessageSquareText,
} from "lucide-react";
import type {
  Alert,
  AlertNotificationChannel,
  UpdateAlertPayload,
} from "@/interfaces/alert.interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const CHANNELS: Array<{
  channel: AlertNotificationChannel;
  title: string;
  description: string;
  Icon: typeof Mail;
  iconClassName: string;
}> = [
  {
    channel: "email",
    title: "Correo electrónico",
    description: "Recibe los detalles completos en tu bandeja de entrada.",
    Icon: Mail,
    iconClassName: "bg-sky-50 text-sky-700",
  },
  {
    channel: "push",
    title: "Notificación push",
    description: "Un aviso inmediato en tus dispositivos.",
    Icon: BellRing,
    iconClassName: "bg-violet-50 text-violet-700",
  },
  {
    channel: "in_app",
    title: "Centro de notificaciones",
    description: "Consulta el aviso dentro de WiAuto.",
    Icon: LayoutPanelTop,
    iconClassName: "bg-indigo-50 text-indigo-700",
  },
  {
    channel: "sms",
    title: "SMS",
    description: "Un mensaje de texto a tu número registrado.",
    Icon: MessageSquareText,
    iconClassName: "bg-amber-50 text-amber-700",
  },
  {
    channel: "whatsapp",
    title: "WhatsApp",
    description: "Un mensaje directo en WhatsApp.",
    Icon: MessageCircleMore,
    iconClassName: "bg-emerald-50 text-emerald-700",
  },
];

type SavedSearchAlertDialogProps = {
  alert: Alert;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (payload: UpdateAlertPayload) => Promise<void>;
  isUpdating?: boolean;
};

export function SavedSearchAlertDialog({
  alert,
  open,
  onOpenChange,
  onUpdate,
  isUpdating = false,
}: SavedSearchAlertDialogProps) {
  const toggleChannel = (channel: AlertNotificationChannel) => {
    const enabled = alert.notification_channels.includes(channel);
    void onUpdate({
      notification_channels: enabled
        ? alert.notification_channels.filter((value) => value !== channel)
        : [...alert.notification_channels, channel],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:max-w-xl">
        <DialogHeader className="border-b border-slate-100 px-6 py-5 text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            Entrega inmediata
          </p>
          <DialogTitle className="text-xl">Configurar alerta</DialogTitle>
          <DialogDescription>
            {alert.name}. Elige exactamente por dónde quieres recibir cada nuevo
            vehículo que coincida con esta búsqueda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <div>
              <Label htmlFor={`${alert.id}-active`} className="text-sm font-bold text-slate-950">
                Alerta activa
              </Label>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Pausa todos los envíos de esta búsqueda sin perder tu configuración.
              </p>
            </div>
            <Switch
              id={`${alert.id}-active`}
              checked={alert.is_active}
              disabled={isUpdating}
              onCheckedChange={(checked) => {
                void onUpdate({ is_active: checked });
              }}
            />
          </div>

          <section aria-labelledby={`${alert.id}-channels-title`}>
            <div className="mb-3">
              <h3 id={`${alert.id}-channels-title`} className="text-sm font-bold text-slate-950">
                Canales de entrega
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Puedes activar uno, varios o todos. Cada canal funciona de forma independiente.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {CHANNELS.map(({ channel, title, description, Icon, iconClassName }, index) => {
                const enabled = alert.notification_channels.includes(channel);
                const inputId = `${alert.id}-${channel}`;

                return (
                  <div
                    key={channel}
                    className={`flex items-center gap-3 p-4 ${index > 0 ? "border-t border-slate-100" : ""}`}
                  >
                    <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Label htmlFor={inputId} className="cursor-pointer text-sm font-semibold text-slate-900">
                        {title}
                      </Label>
                      <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
                    </div>
                    <Switch
                      id={inputId}
                      checked={enabled}
                      disabled={isUpdating || !alert.is_active}
                      aria-label={`${enabled ? "Desactivar" : "Activar"} ${title}`}
                      onCheckedChange={() => toggleChannel(channel)}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
