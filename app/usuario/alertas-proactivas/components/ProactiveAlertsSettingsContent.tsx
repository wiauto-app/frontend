"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntitlements } from "@/hooks/useEntitlements";
import {
  PROACTIVE_ALERT_GROUP_LABELS,
  PROACTIVE_ALERT_GROUP_ORDER,
  type ProactiveAlertCatalogItem,
  type ProactiveAlertGroup,
} from "@/lib/proactive-alerts/proactive-alert-catalog";
import {
  PROACTIVE_ALERTS_SETTINGS_QUERY_KEY,
  proactiveAlertsService,
} from "@/services/proactiveAlertsService";

const groupCatalogItems = (
  catalog: ProactiveAlertCatalogItem[],
): Map<ProactiveAlertGroup, ProactiveAlertCatalogItem[]> => {
  const map = new Map<ProactiveAlertGroup, ProactiveAlertCatalogItem[]>();
  for (const group of PROACTIVE_ALERT_GROUP_ORDER) {
    map.set(
      group,
      catalog.filter((item) => item.group === group),
    );
  }
  return map;
};

export const ProactiveAlertsSettingsContent = () => {
  const queryClient = useQueryClient();
  const { has } = useEntitlements();
  const planIncludesAlerts = has("proactive_alerts");

  const settingsQuery = useQuery({
    queryKey: PROACTIVE_ALERTS_SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const response = await proactiveAlertsService.getSettings();
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar las alertas proactivas.",
        );
      }
      return response.data;
    },
  });

  const patchMutation = useMutation({
    mutationFn: async (enabled_types: string[]) => {
      const response = await proactiveAlertsService.patchSettings({
        enabled_types,
      });
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron guardar los ajustes.");
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(PROACTIVE_ALERTS_SETTINGS_QUERY_KEY, data);
      toast.success("Ajustes guardados");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const enabledSet = new Set(settingsQuery.data?.enabled_types ?? []);
  const grouped = groupCatalogItems(settingsQuery.data?.catalog ?? []);

  const handleToggleType = (type: string, checked: boolean) => {
    if (!planIncludesAlerts || !settingsQuery.data) {
      toast.error("Amplía tu plan para configurar alertas proactivas.");
      return;
    }

    const catalogTypes = settingsQuery.data.catalog.map((item) => item.type);
    const next = new Set(enabledSet);
    if (checked) {
      next.add(type);
    } else {
      next.delete(type);
    }

    const enabled_types = catalogTypes.filter((item) => next.has(item));
    patchMutation.mutate(enabled_types);
  };

  if (settingsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (settingsQuery.isError) {
    return (
      <p className="text-sm text-destructive">
        {settingsQuery.error instanceof Error
          ? settingsQuery.error.message
          : "No se pudieron cargar los ajustes."}
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-20">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BellRing className="size-6 text-gray-800" aria-hidden />
          <h1 className="text-2xl font-bold text-gray-900">Alertas proactivas</h1>
        </div>
        <p className="text-sm text-gray-600">
          Elige qué avisos automáticos quieres recibir sobre precio, visitas,
          contactos y destacados. Se respetan tus canales de notificación.
        </p>
      </div>

      {!planIncludesAlerts ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
        >
          <p className="font-medium">Tu plan no incluye alertas proactivas</p>
          <p className="mt-1">
            Actívalas en un plan superior para recibir recomendaciones sobre tus
            anuncios.{" "}
            <Link href="/usuario/monetizacion" className="font-semibold underline">
              Ver planes
            </Link>
          </p>
        </div>
      ) : null}

      <div className="space-y-6">
        {PROACTIVE_ALERT_GROUP_ORDER.map((group) => {
          const items = grouped.get(group) ?? [];
          if (items.length === 0) {
            return null;
          }

          return (
            <section
              key={group}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
            >
              <header className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  {PROACTIVE_ALERT_GROUP_LABELS[group]}
                </h2>
              </header>
              <ul className="divide-y divide-gray-100">
                {items.map((item) => {
                  const checked = enabledSet.has(item.type);
                  const disabled =
                    !planIncludesAlerts || patchMutation.isPending;

                  return (
                    <li
                      key={item.type}
                      className="flex items-start justify-between gap-4 px-4 py-4"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.label}
                        </p>
                        <p className="text-xs leading-relaxed text-gray-600">
                          {item.description}
                        </p>
                        {item.cooldown_days != null ? (
                          <p className="text-[11px] text-gray-400">
                            Enfriamiento: {item.cooldown_days} día
                            {item.cooldown_days === 1 ? "" : "s"}
                          </p>
                        ) : null}
                      </div>
                      <Switch
                        checked={checked}
                        disabled={disabled}
                        aria-label={item.label}
                        onCheckedChange={(value) =>
                          handleToggleType(item.type, value === true)
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {patchMutation.isPending ? (
        <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" aria-hidden />
          Guardando…
        </p>
      ) : null}
    </div>
  );
};
