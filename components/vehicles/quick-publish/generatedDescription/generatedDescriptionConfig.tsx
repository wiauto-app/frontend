import { ObjectiveSelector } from "./objectiveSelector";
import { PersuasionSelector } from "./persuasionSelector";
import { ExtensionSelector } from "./extensionSelector";
import { ToneSelector } from "./toneSelector";
import { useGenerationSettingsStore } from "../stores/generationSettingsStore";

export const GeneratedDescriptionConfigFields = () => {
  const { settings, setSettings } = useGenerationSettingsStore();

  return (
    <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
      <ObjectiveSelector
        value={settings.objective ?? ""}
        onChange={(value) => setSettings({ ...settings, objective: value })}
      />
      <PersuasionSelector
        value={settings.persuasion ?? ""}
        onChange={(value) => setSettings({ ...settings, persuasion: value })}
      />
      <ExtensionSelector
        value={settings.extension ?? ""}
        onChange={(value) => setSettings({ ...settings, extension: value })}
      />
      <ToneSelector
        value={settings.tone ?? ""}
        onChange={(value) => setSettings({ ...settings, tone: value })}
      />
    </div>
  );
};
