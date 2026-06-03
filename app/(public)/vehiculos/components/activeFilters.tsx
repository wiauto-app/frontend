"use client";

import { useEffect } from "react";
import { useActiveFiltersStore } from "../stores/activeFiltersStore";
import { ActiveFiltersChips } from "./ActiveFiltersChips";
import { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";

type ActiveFiltersProps = {
  activeFilters: ActiveFiltersResponse;
};

export const ActiveFilters = ({ activeFilters }: ActiveFiltersProps) => {
  const { setActiveFilters } = useActiveFiltersStore();
  useEffect(() => {
    setActiveFilters(activeFilters);
  }, [activeFilters, setActiveFilters]);
  return <ActiveFiltersChips  />;
};
