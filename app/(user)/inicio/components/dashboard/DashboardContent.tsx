"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutGrid, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/contexts/auth/useUser";
import { useOwnerDashboard } from "../../hooks/useOwnerDashboard";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardKpiGrid } from "./DashboardKpiGrid";
import { DashboardViewsChart } from "./DashboardViewsChart";
import { DashboardWeeklyStatsCard } from "./DashboardWeeklyStatsCard";
import { DashboardOpportunitiesCard } from "./DashboardOpportunitiesCard";
import { DashboardInventorySection } from "./DashboardInventorySection";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardSkeleton } from "./DashboardSkeleton";
import {
  getDateRangeError,
  getDefaultDashboardDateRange,
  isValidDateRange,
} from "./dashboard.utils";

export const DashboardContent = () => {
  const { user, isLoading: isUserLoading } = useUser();
  const defaultDateRange = getDefaultDashboardDateRange();
  const [startDate, setStartDate] = useState(defaultDateRange.startDate);
  const [endDate, setEndDate] = useState(defaultDateRange.endDate);

  const dateRangeError = getDateRangeError(startDate, endDate);
  const isDateRangeValid = isValidDateRange(startDate, endDate);

  const isAuthenticated = Boolean(user);
  const { dashboard, isLoading, error, refetch, isFetching } = useOwnerDashboard({
    startDate,
    endDate,
    enabled: isAuthenticated && isDateRangeValid,
  });

  const headerProps = {
    startDate,
    endDate,
    onStartDateChange: setStartDate,
    onEndDateChange: setEndDate,
    dateRangeError,
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" aria-hidden />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto mt-10">
        <LayoutGrid className="mx-auto h-12 w-12 text-gray-300" aria-hidden />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Inicia sesión para ver tu resumen
        </h2>
        <p className="mt-2 text-gray-500">
          Accede a tus métricas, inventario y oportunidades desde tu panel de inicio.
        </p>
        <Link
          href="/iniciar-sesion"
          className="mt-4 inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (!isDateRangeValid) {
    return (
      <div className="space-y-6 pb-20">
        <DashboardHeader {...headerProps} />
      </div>
    );
  }

  if (isLoading && !dashboard) {
    return (
      <div className="space-y-6 pb-20">
        <DashboardHeader {...headerProps} />
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="space-y-6 pb-20">
        <DashboardHeader {...headerProps} />
        <div className="p-8 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-red-600">
            No se pudo cargar el dashboard. Intenta de nuevo más tarde.
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

  if (!dashboard) {
    return (
      <div className="space-y-6 pb-20">
        <DashboardHeader {...headerProps} />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <DashboardHeader {...headerProps} />

      {isFetching && !isLoading ? (
        <p className="text-xs text-gray-400" aria-live="polite">
          Actualizando datos...
        </p>
      ) : null}

    
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="min-w-0 space-y-4">
        <DashboardKpiGrid
        summary={dashboard.summary}
        viewsTimeSeries={dashboard.views_time_series}
      />

          <DashboardViewsChart
            data={dashboard.views_time_series}
            granularity={dashboard.period.granularity}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardWeeklyStatsCard
              visits={dashboard.weekly_activity.visits}
              messagesReceived={dashboard.weekly_activity.messages_received}
            />
            <DashboardOpportunitiesCard
              unreadMessages={dashboard.opportunities.unread_messages}
            />
          </div>

          <DashboardInventorySection inventory={dashboard.inventory} />
        </div>

        <DashboardSidebar
          dealership={dashboard.dealership}
          support={dashboard.support}
        />
      </div>
    </div>
  );
};
