import { create } from "zustand";
import { SelectedItem } from "../interfaces/makeSelector.interface";

interface SelectedItemsStore {
  selectedItems: SelectedItem[];
  setSelectedItems: (items: SelectedItem[]) => void;
}

export const useSelectedItemsStore =
  create<SelectedItemsStore>((set) => ({
    selectedItems: [],

    setSelectedItems: (items) => {
      set({ selectedItems: items });
    },
  }));