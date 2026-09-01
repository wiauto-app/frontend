import { create } from "zustand";
import { persist } from "zustand/middleware";
interface CardOpenStatusStore {
  isOpen: boolean;
  setIsOpen: (isOpen: CardOpenStatusStore["isOpen"]) => void;
}

export const useCardOpenStatusStore = create<CardOpenStatusStore>()(persist((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}), {
  name: "card-open-status",
})
);