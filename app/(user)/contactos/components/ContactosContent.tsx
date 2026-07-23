"use client";

import { ContactRound } from "lucide-react";
import { DateRangeSelector } from "@/components/date-range-selector/DateRangeSelector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeadSort } from "@/interfaces/lead.interface";
import { LeadCard } from "./LeadCard";
import { useContactosPage } from "../hooks/useContactosPage";

const SORT_ITEMS: { label: string; value: LeadSort }[] = [
  { label: "Más recientes", value: "desc" },
  { label: "Más antiguos", value: "asc" },
];

export const ContactosContent = () => {
  const {
    startDate,
    endDate,
    sort,
    page,
    dateRangeError,
    leads,
    total,
    totalPages,
    isLoading,
    error,
    handleStartDateChange,
    handleEndDateChange,
    handleSortChange,
    handlePageChange,
  } = useContactosPage();

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
            value={sort}
            items={[...SORT_ITEMS]}
            onValueChange={(value) => {
              if (value === "asc" || value === "desc") {
                handleSortChange(value);
              }
            }}
          >
            <SelectTrigger
              className="w-50 border-gray-200 bg-white"
              aria-label="Ordenar contactos"
            >
              <SelectValue placeholder="Orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Más recientes</SelectItem>
              <SelectItem value="asc">Más antiguos</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <LeadCard key={lead.id} lead={lead} />
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
