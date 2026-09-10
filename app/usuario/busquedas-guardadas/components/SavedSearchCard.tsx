"use client";

import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Edit2,
  Mail,
  MessageCircleMore,
  MessageSquareText,
  MoreVertical,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Alert, UpdateAlertPayload } from "@/interfaces/alert.interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SavedSearchAlertToggles } from "./SavedSearchAlertToggles";
import { DeleteSavedSearchDialog } from "./DeleteSavedSearchDialog";
import { buildSavedSearchEditHref } from "../utils/alert-filters.utils";

const channelIcons = {
  email: Mail,
  push: Bell,
  sms: Smartphone,
  in_app: MessageSquareText,
  whatsapp: MessageCircleMore,
} as const;

function readableFilter(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.replaceAll("-", " ");
}

function getFilterSummary(alert: Alert): string[] {
  const { filters } = alert;
  const values = [
    ...(Array.isArray(filters.makes_slugs) ? filters.makes_slugs : []),
    ...(Array.isArray(filters.models_slugs) ? filters.models_slugs : []),
    ...(Array.isArray(filters.provinces_slugs) ? filters.provinces_slugs : []),
  ]
    .map(readableFilter)
    .filter((value): value is string => Boolean(value));

  if (typeof filters.until_price === "number") {
    values.push(`Hasta ${filters.until_price.toLocaleString("es-ES")} €`);
  }

  if (
    typeof filters.since_year === "number" ||
    typeof filters.until_year === "number"
  ) {
    values.push(
      `Año ${filters.since_year ?? ""}${
        filters.since_year && filters.until_year ? " – " : ""
      }${filters.until_year ?? ""}`,
    );
  }

  return values.slice(0, 4);
}

type SavedSearchCardProps = {
  alert: Alert;
  onUpdate: (alertId: string, payload: UpdateAlertPayload) => Promise<void>;
  onDelete: (alertId: string) => Promise<void>;
  onExpand?: (alertId: string) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
};

export const SavedSearchCard = ({
  alert,
  onUpdate,
  onDelete,
  onExpand,
  isUpdating = false,
  isDeleting = false,
}: SavedSearchCardProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleUpdate = async (payload: UpdateAlertPayload) => {
    await onUpdate(alert.id, payload);
  };

  const handleDelete = async () => {
    await onDelete(alert.id);
  };

  const handleExpand = () => {
    void onExpand?.(alert.id);
  };

  const filterSummary = getFilterSummary(alert);

  return (
    <>
      <Accordion className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
        <AccordionItem value={alert.id} className="border-0">
          <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold tracking-tight text-slate-950">
                      {alert.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Alertas al instante cuando se publique un vehículo coincidente.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 lg:hidden">
                    <Switch
                      checked={alert.is_active}
                      disabled={isUpdating}
                      aria-label={`Activar alerta ${alert.name}`}
                      onCheckedChange={(checked) => {
                        void handleUpdate({ is_active: checked });
                      }}
                    />
                    <AccordionTrigger
                      className="size-8 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:no-underline"
                      aria-label={`Configurar alerta ${alert.name}`}
                      onClick={handleExpand}
                    >
                      <MoreVertical className="size-4" />
                    </AccordionTrigger>
                  </div>
                </div>

                {filterSummary.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {filterSummary.map((filter) => (
                      <span
                        key={filter}
                        className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium capitalize text-slate-600"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden shrink-0 items-center gap-2 lg:flex">
                <Switch
                  checked={alert.is_active}
                  disabled={isUpdating}
                  aria-label={`Activar alerta ${alert.name}`}
                  onCheckedChange={(checked) => {
                    void handleUpdate({ is_active: checked });
                  }}
                />
                <AccordionTrigger
                  className="size-9 rounded-full p-0 text-slate-500 hover:bg-slate-100 hover:no-underline"
                  aria-label={`Configurar alerta ${alert.name}`}
                  onClick={handleExpand}
                >
                  <MoreVertical className="size-4" />
                </AccordionTrigger>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="mr-1 text-xs font-medium text-slate-500">Canales</span>
                {alert.notification_channels.map((channel) => {
                  const Icon = channelIcons[channel];
                  return Icon ? (
                    <span
                      key={channel}
                      title={channel}
                      className="inline-flex size-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                    >
                      <Icon className="size-4" />
                    </span>
                  ) : null;
                })}
                {alert.notification_channels.length === 0 && (
                  <span className="text-xs text-slate-400">Sin canales activos</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="text-sm font-medium text-slate-600">
                  <span className="mr-2 inline-block size-2 rounded-full bg-blue-600 align-middle" />
                  {alert.new_matches_count > 0
                    ? `${alert.new_matches_count} resultados nuevos`
                    : "Sin resultados nuevos"}
                </p>
                <Link
                  href={buildSavedSearchEditHref(alert.filters)}
                  aria-label={`Ver resultados de ${alert.name}`}
                  className="inline-flex size-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
                >
                  <ChevronRight className="size-5" />
                </Link>
              </div>
            </div>

          </div>

          <AccordionContent className="px-4 pb-5 sm:px-5">
            <SavedSearchAlertToggles
              alert={alert}
              onUpdate={handleUpdate}
              isUpdating={isUpdating}
            />
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <Link
                href={buildSavedSearchEditHref(alert.filters)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Edit2 className="size-4" />
                Editar filtros
              </Link>
              <Button
                type="button"
                variant="outline"
                className="border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DeleteSavedSearchDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        searchName={alert.name}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};
