"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OwnerDashboardPeriod } from "@/interfaces/owner-dashboard.interface";
import { PERIOD_OPTIONS } from "./dashboard.utils";

type DashboardHeaderProps = {
  period: OwnerDashboardPeriod;
  onPeriodChange: (period: OwnerDashboardPeriod) => void;
};

export const DashboardHeader = ({
  period,
  onPeriodChange,
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
        <Select
          value={period}
          onValueChange={(value) => onPeriodChange(value as OwnerDashboardPeriod)}
        >
          <SelectTrigger
            className="min-w-[180px] border-gray-200 bg-white"
            aria-label="Seleccionar período"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
