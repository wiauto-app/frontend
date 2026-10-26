"use client";

import Link from "next/link";
import { ContactRound, Lock } from "lucide-react";
import { DateRangeSelector } from "@/components/date-range-selector/DateRangeSelector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/simpleTooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeadSort, LeadTierFilter } from "@/interfaces/lead.interface";
import {
  LEAD_TIER_FILTER_TABS,
  LEAD_TIER_UI,
  type LeadTier,
} from "@/lib/leads/lead-scoring-ui";
import { cn } from "@/lib/utils";
import { LeadCard } from "./LeadCard";
import { useContactosPage } from "../hooks/useContactosPage";

type SortOptionValue = LeadSort | "score_desc";

const DATE_SORT_ITEMS: { label: string; value: LeadSort }[] = [
  { label: "Más recientes", value: "desc" },
  { label: "Más antiguos", value: "asc" },
];

const tierCountLabel = (
  tier: LeadTier,
  counts: { hot: number; warm: number; cold: number } | null,
): number => {
  if (!counts) {
    return 0;
  }
  return counts[tier];
};

export const ContactosContent = () => {
  const {
    startDate,
    endDate,
    sort,
    sortBy,
    tierFilter,
    page,
    dateRangeError,
    leads,
    tierCounts,
    scoringLocked,
    total,
    totalPages,
    isLoading,
    error,
    handleStartDateChange,
    handleEndDateChange,
    handleSortChange,
    handleSortByScore,
    handleTierFilterChange,
    handlePageChange,
  } = useContactosPage();

  const sortSelectValue: SortOptionValue =
    sortBy === "score" ? "score_desc" : sort;

  const handleSortSelect = (value: SortOptionValue | null) => {
    if (value === "score_desc") {
      handleSortByScore();
      return;
    }
    if (value === "asc" || value === "desc") {
      handleSortChange(value);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ContactRound className="h-6 w-6 text-gray-700" aria-hidden />
            <h1 className="text-2xl font-bold text-gray-900">Contactos / Leads</h1>
          </div>
          <p className="text-sm text-gray-500">
            Consultas y solicitudes de llamada sobre tus anuncios y los de tu equipo.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            error={dateRangeError}
          />
          <Select
            value={sortSelectValue}
            items={[
              ...DATE_SORT_ITEMS,
              { label: "Más interesados", value: "score_desc" as const },
            ]}
            onValueChange={(value) => {
              if (
                value === "asc" ||
                value === "desc" ||
                value === "score_desc"
              ) {
                handleSortSelect(value);
              }
            }}
          >
            <SelectTrigger
              className="w-full min-w-50 border-gray-200 bg-white sm:w-56"
              aria-label="Ordenar contactos"
            >
              <SelectValue placeholder="Orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Más recientes</SelectItem>
              <SelectItem value="asc">Más antiguos</SelectItem>
              <SelectItem value="score_desc" disabled={scoringLocked}>
                <span className="inline-flex items-center gap-1.5">
                  Más interesados
                  {scoringLocked ? (
                    <Lock className="size-3 text-muted-foreground" aria-hidden />
                  ) : null}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {scoringLocked ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
        >
          <p className="font-medium">Calificación de leads bloqueada</p>
          <p className="mt-1">
            Con un plan que incluya calificación verás nivel de interés, señales y
            filtros por tipo de contacto.{" "}
            <Link href="/usuario/monetizacion" className="font-semibold underline">
              Ver planes
            </Link>
          </p>
        </div>
      ) : null}

      <div className="space-y-3">
        <Tabs
          value={tierFilter}
          onValueChange={(value) => {
            handleTierFilterChange(value as LeadTierFilter);
          }}
        >
          <TabsList
            className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0"
            aria-label="Filtrar por nivel de interés"
          >
            {LEAD_TIER_FILTER_TABS.map((tab) => {
              const tierKey = tab.value === "all" ? null : (tab.value as LeadTier);
              const count =
                tab.value === "all"
                  ? total
                  : tierCountLabel(tierKey as LeadTier, tierCounts);

              const trigger = (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={scoringLocked && tab.value !== "all"}
                  className={cn(
                    "rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs data-[state=active]:border-gray-900 data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                    scoringLocked &&
                      tab.value !== "all" &&
                      "cursor-not-allowed opacity-50",
                  )}
                >
                  {tab.label}
                  {typeof count === "number" ? (
                    <span className="ml-1 tabular-nums opacity-80">({count})</span>
                  ) : null}
                </TabsTrigger>
              );

              if (scoringLocked && tab.value !== "all") {
                return (
                  <SimpleTooltip
                    key={tab.value}
                    content="Incluido en planes con calificación de leads"
                  >
                    <span className="inline-flex">{trigger}</span>
                  </SimpleTooltip>
                );
              }

              return trigger;
            })}
          </TabsList>
        </Tabs>

        {!scoringLocked && tierCounts ? (
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            {(Object.keys(LEAD_TIER_UI) as LeadTier[]).map((tier) => (
              <span
                key={tier}
                className={cn(
                  "rounded-full px-2.5 py-0.5 font-medium",
                  LEAD_TIER_UI[tier].chipClass,
                )}
              >
                {LEAD_TIER_UI[tier].label}: {tierCounts[tier]}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {dateRangeError ? null : isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-white p-6 text-sm text-red-600 shadow-sm">
          {error instanceof Error
            ? error.message
            : "No se pudieron cargar los contactos"}
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-900">
            No hay contactos en este período
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Cuando alguien consulte tus anuncios, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {total} contacto{total === 1 ? "" : "s"}
          </p>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} scoringLocked={scoringLocked} />
          ))}

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                aria-label="Página anterior"
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
                aria-label="Página siguiente"
              >
                Siguiente
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
