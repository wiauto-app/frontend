"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "@/components/date-range-selector/DateRangeSelector";

interface DashboardHeaderProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  dateRangeError?: string | null;
}

export const DashboardHeader = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  dateRangeError,
}: DashboardHeaderProps) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Resumen y analytics</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Consulta el rendimiento de tus anuncios, el estado del inventario y las
          oportunidades pendientes en un solo lugar.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          error={dateRangeError}
        />

        <Button
          type="button"
          variant="outline"
          className="border-gray-200 text-gray-500"
          disabled
          title="Próximamente"
        >
          <FileDown className="size-4" aria-hidden />
          Exportar PDF
          <span className="sr-only">Próximamente</span>
        </Button>
        <span className="text-xs text-gray-400">Próximamente</span>
      </div>
    </header>
  );
};
