import { create } from "zustand";

import type { LocationSelectedItem } from "../interfaces/locationSelector.interface";

interface SelectedLocationItemsStore {
  selectedItems: LocationSelectedItem[];
  setSelectedItems: (items: LocationSelectedItem[]) => void;
}

export const useSelectedLocationItemsStore =
  create<SelectedLocationItemsStore>((set) => ({
    selectedItems: [],

    setSelectedItems: (items) => {
      set({ selectedItems: items });
    },
  }));
