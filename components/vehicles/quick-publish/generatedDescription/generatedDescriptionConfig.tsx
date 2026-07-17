import { Settings } from "lucide-react";
import { ObjectiveSelector } from "./objectiveSelector";
import { PersuasionSelector } from "./persuasionSelector";
import { ExtensionSelector } from "./extensionSelector";
import { ToneSelector } from "./toneSelector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconContainer } from "@/components/ui/iconContainer";
import { Separator } from "@/components/ui/separator";
import { useGenerationSettingsStore } from "../stores/generationSettingsStore";

export const GeneratedDescriptionConfig = () => {
  const { settings, setSettings } = useGenerationSettingsStore();
  return (
    <Accordion className="rounded-lg border">
      <AccordionItem value="Configuración de la descripción">
        <AccordionTrigger className="flex items-center gap-2 px-4">
          <IconContainer Icon={Settings} />
          Configuración de la descripción
        </AccordionTrigger>
        <Separator />
        <AccordionContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ObjectiveSelector
              value={settings.objective ?? ""}
              onChange={(value) =>
                setSettings({ ...settings, objective: value })
              }
            />
            <PersuasionSelector
              value={settings.persuasion ?? ""}
              onChange={(value) =>
                setSettings({ ...settings, persuasion: value })
              }
            />
            <ExtensionSelector
              value={settings.extension ?? ""}
              onChange={(value) =>
                setSettings({ ...settings, extension: value })
              }
            />
            <ToneSelector
              value={settings.tone ?? ""}
              onChange={(value) => setSettings({ ...settings, tone: value })}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
