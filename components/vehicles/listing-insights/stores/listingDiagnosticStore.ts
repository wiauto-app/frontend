import { create } from "zustand";

interface ListingDiagnosticStore {
  vehicleId: string | null;
  openDiagnostic: (vehicleId: string) => void;
  closeDiagnostic: () => void;
}

export const useListingDiagnosticStore = create<ListingDiagnosticStore>(
  (set) => ({
    vehicleId: null,
    openDiagnostic: (vehicleId) => set({ vehicleId }),
    closeDiagnostic: () => set({ vehicleId: null }),
  }),
);
