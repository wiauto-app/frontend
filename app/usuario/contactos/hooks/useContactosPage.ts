"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getDateRangeError,
  getDefaultDashboardDateRange,
  toLocalDayEndIso,
  toLocalDayStartIso,
} from "@/app/usuario/inicio/components/dashboard/dashboard.utils";
import { useEntitlements } from "@/hooks/useEntitlements";
import type {
  LeadListSortBy,
  LeadSort,
  LeadTierFilter,
} from "@/interfaces/lead.interface";
import type { LeadTier } from "@/lib/leads/lead-scoring-ui";
import { LEADS_QUERY_KEY, leadService } from "@/services/leadService";

const DEFAULT_LIMIT = 20;

export const useContactosPage = () => {
  const { has } = useEntitlements();
  const hasLeadScoring = has("lead_scoring");

  const defaultRange = getDefaultDashboardDateRange();
  const [startDate, setStartDate] = useState(defaultRange.startDate);
  const [endDate, setEndDate] = useState(defaultRange.endDate);
  const [sort, setSort] = useState<LeadSort>("desc");
  const [sortBy, setSortBy] = useState<LeadListSortBy>("date");
  const [tierFilter, setTierFilter] = useState<LeadTierFilter>("all");
  const [page, setPage] = useState(1);

  const dateRangeError = getDateRangeError(startDate, endDate);
  const hasValidRange = !dateRangeError;

  const leadsQuery = useQuery({
    queryKey: [
      ...LEADS_QUERY_KEY,
      startDate,
      endDate,
      sort,
      sortBy,
      tierFilter,
      page,
      hasLeadScoring,
    ],
    enabled: hasValidRange,
    queryFn: async () => {
      const response = await leadService.findAll({
        from: toLocalDayStartIso(startDate),
        to: toLocalDayEndIso(endDate),
        sort,
        sort_by: hasLeadScoring ? sortBy : "date",
        tier:
          hasLeadScoring && tierFilter !== "all"
            ? (tierFilter as LeadTier)
            : undefined,
        page,
        limit: DEFAULT_LIMIT,
      });
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudieron cargar los contactos");
      }
      return response.data;
    },
  });

  const scoringLocked =
    leadsQuery.data?.scoring_locked ?? !hasLeadScoring;

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
    setSortBy("date");
    setPage(1);
  };

  const handleSortByScore = () => {
    if (scoringLocked) {
      return;
    }
    setSortBy("score");
    setSort("desc");
    setPage(1);
  };

  const handleTierFilterChange = (value: LeadTierFilter) => {
    if (scoringLocked && value !== "all") {
      return;
    }
    setTierFilter(value);
    setPage(1);
  };

  const total = leadsQuery.data?.total ?? 0;
  const limit = leadsQuery.data?.limit ?? DEFAULT_LIMIT;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    startDate,
    endDate,
    sort,
    sortBy,
    tierFilter,
    page,
    dateRangeError,
    leads: leadsQuery.data?.data ?? [],
    tierCounts: leadsQuery.data?.tier_counts ?? null,
    scoringLocked,
    total,
    totalPages,
    isLoading: leadsQuery.isLoading,
    isFetching: leadsQuery.isFetching,
    error: leadsQuery.error,
    handleStartDateChange,
    handleEndDateChange,
    handleSortChange,
    handleSortByScore,
    handleTierFilterChange,
    handlePageChange: setPage,
    refetch: leadsQuery.refetch,
  };
};
