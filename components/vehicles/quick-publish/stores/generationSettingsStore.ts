import { create, } from "zustand";
import { persist } from "zustand/middleware";
export interface GenerationSettings {
  objective: string | null;
  persuasion: string | null;
  extension: string | null;
  tone: string | null;
}

interface GenerationSettingsStore {
  settings: GenerationSettings;
  setSettings: (settings: GenerationSettings) => void;
}

export const useGenerationSettingsStore = create<GenerationSettingsStore>()(persist((set) => ({
  settings: {
    objective: null,
    persuasion: null,
    extension: null,
    tone: null,
  },
  setSettings: (settings) => set({ settings }),
}), {
  name: "generation-settings", 
}));