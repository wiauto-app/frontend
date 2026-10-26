import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppDownloadBannerStore {
  isDismissed: boolean;
  dismiss: () => void;
}

export const useAppDownloadBannerStore = create<AppDownloadBannerStore>()(
  persist(
    (set) => ({
      isDismissed: false,
      dismiss: () => set({ isDismissed: true }),
    }),
    {
      name: "app-download-banner",
    },
  ),
);
