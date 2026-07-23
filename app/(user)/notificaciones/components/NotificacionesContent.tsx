"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Bell,
  Bookmark,
  LayoutGrid,
  Mail,
  MessageSquare,
  Monitor,
  Smartphone,
  Tag,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import type {
  AlertNotificationPreferences,
  UpdateAlertNotificationPreferencesPayload,
} from "@/interfaces/alert-notification-preferences.interface";
import type { InAppNotification } from "@/interfaces/notification.interface";
import { useNotificacionesPage } from "../hooks/useNotificacionesPage";

interface ChannelItem {
  field: keyof Pick<
    AlertNotificationPreferences,
    "channel_push" | "channel_email" | "channel_in_app" | "channel_whatsapp"
  >;
  label: string;
  icon: LucideIcon;
}

interface AlertTypeItem {
  field: keyof Pick<
    AlertNotificationPreferences,
    | "notify_new_matches"
    | "notify_price_drops"
    | "notify_favorite_changes"
    | "notify_new_messages"
    | "notify_seller_replies"
    | "notify_saved_vehicle_reminders"
    | "notify_new_leads"
  >;
  label: string;
}

const CHANNEL_ITEMS: ChannelItem[] = [
  { field: "channel_push", label: "Push móvil", icon: Smartphone },
  { field: "channel_email", label: "Email", icon: Mail },
  { field: "channel_in_app", label: "In-app", icon: Monitor },
  { field: "channel_whatsapp", label: "WhatsApp", icon: MessageSquare },
];

const ALERT_TYPE_ITEMS: AlertTypeItem[] = [
  {
    field: "notify_new_matches",
    label: "Nuevos anuncios en búsquedas guardadas",
  },
  {
    field: "notify_price_drops",
    label: "Bajadas de precio",
  },
  {
    field: "notify_favorite_changes",
    label: "Cambios en favoritos",
  },
  {
    field: "notify_new_messages",
    label: "Nuevo mensaje en chat",
  },
  {
    field: "notify_seller_replies",
    label: "Respuestas de vendedores",
  },
  {
    field: "notify_saved_vehicle_reminders",
    label: "Recordatorios de vehículos guardados",
  },
  {
    field: "notify_new_leads",
    label: "Nuevos contactos / leads",
  },
];

interface CategoryIconProps {
  category: string;
  className?: string;
}

const CategoryIcon = ({ category, className }: CategoryIconProps) => {
  switch (category) {
    case "lead":
      return <MessageSquare className={className} aria-hidden />;
    case "price_drop":
      return <Tag className={className} aria-hidden />;
    case "favorite_change":
      return <Bookmark className={className} aria-hidden />;
    case "new_listing":
    case "new_match":
    default:
      return <Bell className={className} aria-hidden />;
  }
};

const formatNotificationTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: es,
  }).toUpperCase();
};

interface PreferenceToggleProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: LucideIcon;
}

const PreferenceToggle = ({
  id,
  label,
  checked,
  disabled = false,
  onCheckedChange,
  icon: Icon,
}: PreferenceToggleProps) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-4">
    <div className="flex min-w-0 items-center gap-3 text-gray-700">
      {Icon ? <Icon className="h-5 w-5 shrink-0 text-blue-500" aria-hidden /> : null}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <Switch
      id={id}
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onCheckedChange={onCheckedChange}
    />
  </div>
);

interface NotificationInboxItemProps {
  notification: InAppNotification;
  isMarking: boolean;
  onMarkRead: (id: string) => void;
}

const NotificationInboxItem = ({
  notification,
  isMarking,
  onMarkRead,
}: NotificationInboxItemProps) => {
  const isUnread = !notification.read_at;

  return (
    <div className="flex items-start gap-4 p-6 transition-colors hover:bg-gray-50/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <CategoryIcon category={notification.category} className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-gray-900">{notification.title}</h3>
        <p className="mt-0.5 text-sm text-gray-500">{notification.body}</p>
        <p className="mt-2 text-[10px] font-semibold tracking-wide text-gray-400">
          {formatNotificationTime(notification.created_at)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <div
          className={`mt-1 h-2 w-2 rounded-full ${
            isUnread ? "bg-blue-600" : "bg-gray-300"
          }`}
          aria-label={isUnread ? "No leída" : "Leída"}
        />
        {isUnread ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-gray-500"
            disabled={isMarking}
            onClick={() => onMarkRead(notification.id)}
            aria-label={`Marcar como leída: ${notification.title}`}
          >
            Marcar leída
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export const NotificacionesContent = () => {
  const {
    preferences,
    notifications,
    unreadCount,
    isLoadingPreferences,
    isLoadingInbox,
    preferencesError,
    inboxError,
    page,
    totalPages,
    isUpdatingPreferences,
    isMarkingRead,
    isMarkingAllRead,
    handlePageChange,
    handleUpdatePreferences,
    handleMarkRead,
    handleMarkAllRead,
  } = useNotificacionesPage();

  const handleTogglePreference = (
    field: keyof UpdateAlertNotificationPreferencesPayload,
    checked: boolean,
  ) => {
    void handleUpdatePreferences({ [field]: checked });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-gray-700" aria-hidden />
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/busquedas-guardadas" />}
        >
          Nueva búsqueda
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-gray-900">Canales</h2>
        {isLoadingPreferences ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : preferencesError || !preferences ? (
          <p className="text-sm text-red-600" role="alert">
            {preferencesError instanceof Error
              ? preferencesError.message
              : "No se pudieron cargar los canales"}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {CHANNEL_ITEMS.map((channel) => (
              <PreferenceToggle
                key={channel.field}
                id={`channel-${channel.field}`}
                label={channel.label}
                icon={channel.icon}
                checked={preferences[channel.field]}
                disabled={isUpdatingPreferences}
                onCheckedChange={(checked) =>
                  handleTogglePreference(channel.field, checked)
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-6">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Recientes</h2>
            {unreadCount > 0 ? (
              <p className="mt-1 text-xs text-gray-500">
                {unreadCount} sin leer
              </p>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isMarkingAllRead}
              onClick={() => {
                void handleMarkAllRead();
              }}
            >
              Marcar todas leídas
            </Button>
          ) : null}
        </div>

        {isLoadingInbox ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : inboxError ? (
          <p className="p-6 text-sm text-red-600" role="alert">
            {inboxError instanceof Error
              ? inboxError.message
              : "No se pudieron cargar las notificaciones"}
          </p>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-gray-900">
              No tienes notificaciones todavía
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Cuando lleguen alertas o leads, aparecerán aquí en tiempo real.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationInboxItem
                  key={notification.id}
                  notification={notification}
                  isMarking={isMarkingRead}
                  onMarkRead={(id) => {
                    void handleMarkRead(id);
                  }}
                />
              ))}
            </div>
            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-3 border-t border-gray-100 p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  aria-label="Página anterior de notificaciones"
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  aria-label="Página siguiente de notificaciones"
                >
                  Siguiente
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-gray-900">Tipos de alertas</h2>
        {isLoadingPreferences ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : preferencesError || !preferences ? (
          <p className="text-sm text-red-600" role="alert">
            {preferencesError instanceof Error
              ? preferencesError.message
              : "No se pudieron cargar los tipos de alertas"}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ALERT_TYPE_ITEMS.map((alerta) => (
              <PreferenceToggle
                key={alerta.field}
                id={`alerta-${alerta.field}`}
                label={alerta.label}
                checked={preferences[alerta.field]}
                disabled={isUpdatingPreferences}
                onCheckedChange={(checked) =>
                  handleTogglePreference(alerta.field, checked)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
