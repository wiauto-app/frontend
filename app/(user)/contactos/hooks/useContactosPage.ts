"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getDateRangeError,
  getDefaultDashboardDateRange,
  toLocalDayEndIso,
  toLocalDayStartIso,
} from "@/app/(user)/inicio/components/dashboard/dashboard.utils";
import type { LeadSort } from "@/interfaces/lead.interface";
import { LEADS_QUERY_KEY, leadService } from "@/services/leadService";

const DEFAULT_LIMIT = 20;

export const useContactosPage = () => {
  const defaultRange = getDefaultDashboardDateRange();
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [sort, setSort] = useState<LeadSort>("desc");
  const [page, setPage] = useState(1);

  const dateRangeError = getDateRangeError(startDate, endDate);
  const hasValidRange = !dateRangeError;

  const leadsQuery = useQuery({
    queryKey: [...LEADS_QUERY_KEY, startDate, endDate, sort, page],
    enabled: hasValidRange,
    queryFn: async () => {
      const response = await leadService.findAll({
        from: toLocalDayStartIso(startDate),
        to: toLocalDayEndIso(endDate),
        sort,
        page,
        limit: DEFAULT_LIMIT,
      });
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron cargar los contactos");
      }
      return response.data;
    },
  });

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setPage(1);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setPage(1);
  };

  const handleSortChange = (value: LeadSort) => {
    setSort(value);
    setPage(1);
  };

  const total = leadsQuery.data?.total ?? 0;
  const limit = leadsQuery.data?.limit ?? DEFAULT_LIMIT;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    startDate,
    endDate,
    sort,
    page,
    dateRangeError,
    leads: leadsQuery.data?.data ?? [],
    total,
    totalPages,
    isLoading: leadsQuery.isLoading,
    isFetching: leadsQuery.isFetching,
    error: leadsQuery.error,
    handleStartDateChange,
    handleEndDateChange,
    handleSortChange,
    handlePageChange: setPage,
    refetch: leadsQuery.refetch,
  };
};
