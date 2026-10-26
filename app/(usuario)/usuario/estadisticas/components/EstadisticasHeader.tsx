"use client";

import { DateRangeSelector } from "@/components/date-range-selector/DateRangeSelector";

interface EstadisticasHeaderProps {
  since: string;
  until: string;
  onSinceChange: (value: string) => void;
  onUntilChange: (value: string) => void;
  dateRangeError?: string | null;
}

export const EstadisticasHeader = ({
  since,
  until,
  onSinceChange,
  onUntilChange,
  dateRangeError,
}: EstadisticasHeaderProps) => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Analiza el alcance de tus anuncios y cómo interactúan los
          compradores con ellos en el período seleccionado.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <DateRangeSelector
          startDate={since}
          endDate={until}
          onStartDateChange={onSinceChange}
          onEndDateChange={onUntilChange}
          error={dateRangeError}
        />
      </div>
    </header>
  );
};
