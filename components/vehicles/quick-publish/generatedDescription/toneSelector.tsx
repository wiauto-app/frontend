import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseSelector } from "./baseSelector";
import { Megaphone } from "lucide-react";

const options = [
  { label: "Formal", value: "formal" },
  { label: "Profesional", value: "professional" },
  { label: "Casual", value: "casual" },
  { label: "Cercano", value: "close" },
  { label: "Amigable", value: "friendly" },
  { label: "Entusiasta", value: "enthusiastic" },
  { label: "Elegante", value: "elegant" },
  { label: "Premium", value: "premium" },
  { label: "Deportivo", value: "sporty" },
  { label: "Persuasivo", value: "persuasive" },
  { label: "Urgente", value: "urgent" },
  { label: "Exclusivo", value: "exclusive" },
];

export const ToneSelector = ({ value, onChange }: { value: string, onChange: (value: string | null) => void }) => {
  return (
    <BaseSelector
      Icon={Megaphone}
      type="radio"
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Selecciona un tono"
    />
  );
};
