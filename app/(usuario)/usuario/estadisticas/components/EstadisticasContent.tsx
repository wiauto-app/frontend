"use client";

import Link from "next/link";
import { useState } from "react";
import { BarChart3, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/contexts/auth/useUser";
import { useOwnerStatistics } from "../hooks/useOwnerStatistics";
import {
  getDateRangeError,
  getDefaultEstadisticasDateRange,
  isValidDateRange,
} from "../utils/estadisticas.utils";
import { EstadisticasHeader } from "./EstadisticasHeader";
import { EstadisticasReachSection } from "./EstadisticasReachSection";
import { EstadisticasActionsSection } from "./EstadisticasActionsSection";
import { EstadisticasChart } from "./EstadisticasChart";
import { EstadisticasSkeleton } from "./EstadisticasSkeleton";

export const EstadisticasContent = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const defaultDateRange = getDefaultEstadisticasDateRange();
  const [since, setSince] = useState(defaultDateRange.since);
  const [until, setUntil] = useState(defaultDateRange.until);

  const dateRangeError = getDateRangeError(since, until);
  const isDateRangeValid = isValidDateRange(since, until);

  const isAuthenticated = Boolean(user);
  const { statistics, isLoading, error, refetch, isFetching } =
    useOwnerStatistics({
      since,
      until,
      enabled: isAuthenticated && isDateRangeValid,
    });

  const headerProps = {
    since,
    until,
    onSinceChange: setSince,
    onUntilChange: setUntil,
    dateRangeError,
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden />
      </div>
    );
  }


  if (!isDateRangeValid) {
    return (
      <div className="space-y-6 pb-20">
        <EstadisticasHeader {...headerProps} />
      </div>
    );
  }

  if (isLoading && !statistics) {
    return (
      <div className="space-y-6 pb-20">
        <EstadisticasHeader {...headerProps} />
        <EstadisticasSkeleton />
      </div>
    );
  }

  if (error && !statistics) {
    return (
      <div className="space-y-6 pb-20">
        <EstadisticasHeader {...headerProps} />
        <div className="p-8 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-red-600">
            No se pudieron cargar las estadísticas. Intenta de nuevo más
            tarde.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 border-gray-200"
            onClick={() => void refetch()}
          >
            <RefreshCw className="size-4" aria-hidden />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="space-y-6 pb-20">
        <EstadisticasHeader {...headerProps} />
        <EstadisticasSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <EstadisticasHeader {...headerProps} />

      {isFetching && !isLoading ? (
        <p className="text-xs text-gray-400" aria-live="polite">
          Actualizando datos...
        </p>
      ) : null}

      <EstadisticasReachSection reach={statistics.reach} />
      <EstadisticasActionsSection actions={statistics.actions} />
      <EstadisticasChart
        data={statistics.time_series}
        granularity={statistics.period.granularity}
      />
    </div>
  );
};
