import { create } from "zustand";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

interface SelectedVehicleStore {
  selectedVehicle: VehicleListItem | null;
  setSelectedVehicle: (vehicle: VehicleListItem) => void;
  clearSelectedVehicle: () => void;
}

export const useSelectedVehicleStore = create<SelectedVehicleStore>(
  (set) => ({
    selectedVehicle: null,

    setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

    clearSelectedVehicle: () => set({ selectedVehicle: null }),
  }),
);
