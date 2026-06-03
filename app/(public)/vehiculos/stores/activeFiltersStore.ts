import { create } from "zustand";
import { ActiveFiltersResponse } from "@/interfaces/active-filters.interface";

interface ActiveFiltersStore {
  activeFilters: ActiveFiltersResponse | null;
  setActiveFilters: (
    activeFilters: ActiveFiltersResponse | null,
  ) => void;
  resetActiveFilters: () => void;
}

export const useActiveFiltersStore =
  create<ActiveFiltersStore>((set) => ({
    activeFilters: null,

    setActiveFilters: (activeFilters) =>
      set({ activeFilters }),

    resetActiveFilters: () =>
      set({ activeFilters: null }),
  }));