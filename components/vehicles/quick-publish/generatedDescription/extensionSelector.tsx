
import { MessageSquareText } from "lucide-react";
import { BaseSelector } from "./baseSelector";

const options = [
  { label: "Muy corta (1-2 líneas)", value: "very-short" },
  { label: "Corta (50-80 palabras)", value: "short" },
  { label: "Media (100-150 palabras)", value: "medium" },
  { label: "Larga (200-300 palabras)", value: "long" },
  { label: "Muy detallada", value: "very-detailed" },
];

export const ExtensionSelector = ({ value, onChange }: { value: string, onChange: (value: string | null) => void }) => {
  return (
    <BaseSelector Icon={MessageSquareText} type="radio" value={value} onChange={onChange} options={options} placeholder="Selecciona una extensión" />
  );
};
