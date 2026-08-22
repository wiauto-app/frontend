"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Bell } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { InAppNotification } from "@/interfaces/notification.interface";
import { cn } from "@/lib/utils";
import { useNavbarNotifications } from "../hooks/useNavbarNotifications";
import { Button } from "@/components/ui/button";

const formatNotificationTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: es,
  });
};

interface NotificationDropdownItemProps {
  notification: InAppNotification;
  href: string;
  disabled: boolean;
  onSelect: (notification: InAppNotification) => void;
}

const NotificationDropdownItem = ({
  notification,
  href,
  disabled,
  onSelect,
}: NotificationDropdownItemProps) => {
  const isUnread = !notification.read_at;

  return (
    <DropdownMenuItem
      disabled={disabled}
      className="cursor-pointer items-start gap-2 p-0"
      render={
        <Link
          href={href}
          className="flex w-full items-start gap-2 px-2 py-2"
          onClick={() => onSelect(notification)}
        >
          <span
            className={cn(
              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
              isUnread ? "bg-blue-600" : "bg-transparent",
            )}
            aria-hidden={!isUnread}
            aria-label={isUnread ? "No leída" : undefined}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-slate-900">
              {notification.title}
            </span>
            <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {notification.body}
            </span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {formatNotificationTime(notification.created_at)}
            </span>
          </span>
        </Link>
      }
    />
  );
};

export const NotificationsDropdown = () => {
  const {
    isAuthenticated,
    notifications,
    unreadCount,
    isLoading,
    isError,
    errorMessage,
    isMarkingRead,
    isMarkingAllRead,
    getNotificationHref,
    handleMarkRead,
    handleMarkAllRead,
  } = useNavbarNotifications();

  if (!isAuthenticated) {
    return null;
  }

  const badgeLabel =
    unreadCount > 99 ? "99+" : unreadCount > 0 ? String(unreadCount) : null;

  const handleSelectNotification = (notification: InAppNotification) => {
    if (notification.read_at) {
      return;
    }
    void handleMarkRead(notification.id).catch(() => {
      // El hook ya muestra el toast de error
    });
  };

  const handleMarkAll = () => {
    if (unreadCount === 0 || isMarkingAllRead) {
      return;
    }
    void handleMarkAllRead();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={
              unreadCount > 0
                ? `Notificaciones, ${unreadCount} sin leer`
                : "Notificaciones"
            }
          >
            <Bell className="size-5" aria-hidden />
            {badgeLabel ? (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {badgeLabel}
              </span>
            ) : null}
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-80 sm:w-96">
        <div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
          <p className="text-sm font-semibold text-slate-900">Notificaciones</p>
          {unreadCount > 0 ? (
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
              disabled={isMarkingAllRead}
              onClick={handleMarkAll}
              aria-label="Marcar todas como leídas"
            >
              Marcar todas
            </button>
          ) : null}
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {isLoading ? (
            <div className="space-y-2 px-3 py-2" aria-busy="true">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <p
              className="px-3 py-6 text-center text-sm text-red-600"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : notifications.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No tienes notificaciones
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationDropdownItem
                key={notification.id}
                notification={notification}
                href={getNotificationHref(notification)}
                disabled={isMarkingRead}
                onSelect={handleSelectNotification}
              />
            ))
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={
            <Link
              href="/notificaciones"
              className="flex justify-center px-2 py-2 text-sm font-medium text-primary"
            >
              Ver todas
            </Link>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
