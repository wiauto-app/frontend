"use client";

import Link from "next/link";
import {
  ChevronRight,
  Edit2,
  Settings2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { Alert, UpdateAlertPayload } from "@/interfaces/alert.interface";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DeleteSavedSearchDialog } from "./DeleteSavedSearchDialog";
import { SavedSearchAlertDialog } from "./SavedSearchAlertDialog";
import { buildSavedSearchEditHref } from "../utils/alert-filters.utils";
import { Card, CardContent } from "@/components/ui/card";

const channelLabels = {
  email: "Correo",
  push: "Push",
  sms: "SMS",
  in_app: "En WiAuto",
  whatsapp: "WhatsApp",
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
  const [settingsOpen, setSettingsOpen] = useState(false);

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
      <Card size="sm">
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold tracking-tight text-slate-950">
                {alert.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Recibirás los nuevos vehículos coincidentes al instante.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-800">
                  {alert.is_active ? "Alerta activa" : "Alerta pausada"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">Entrega inmediata</p>
              </div>
              <Switch
                checked={alert.is_active}
                disabled={isUpdating}
                aria-label={`Activar alerta ${alert.name}`}
                onCheckedChange={(checked) => {
                  void handleUpdate({ is_active: checked });
                }}
              />
            </div>
          </div>

          {filterSummary.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
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

          <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-900">Canales de entrega</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {alert.notification_channels.length > 0 ? (
                    alert.notification_channels.map((channel) => (
                      <span
                        key={channel}
                        className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-100"
                      >
                        {channelLabels[channel]}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">Sin canales activos</span>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                className="shrink-0 border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                onClick={() => {
                  handleExpand();
                  setSettingsOpen(true);
                }}
              >
                <Settings2 className="size-4" />
                Configurar
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-600">
              <span className="mr-2 inline-block size-2 rounded-full bg-blue-600 align-middle" />
              {alert.new_matches_count > 0
                ? `${alert.new_matches_count} resultados nuevos`
                : "Sin resultados nuevos"}
            </p>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <Link
                href={buildSavedSearchEditHref(alert.filters)}
                className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <Edit2 className="size-4" />
                Editar filtros
              </Link>
              <Button
                type="button"
                variant="outline"
                className="border-red-100 px-3 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                aria-label={`Eliminar alerta ${alert.name}`}
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                <span>Eliminar</span>
              </Button>
              <Link
                href={buildSavedSearchEditHref(alert.filters)}
                aria-label={`Ver resultados de ${alert.name}`}
                className="inline-flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700"
              >
                <ChevronRight className="size-5" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <SavedSearchAlertDialog
        alert={alert}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />

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
