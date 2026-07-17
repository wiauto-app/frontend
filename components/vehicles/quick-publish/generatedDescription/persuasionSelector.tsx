import { Megaphone } from "lucide-react";
import { BaseSelector } from "./baseSelector";

const options = [
  { label: "Informativo", value: "informative" },
  { label: "Balanceado", value: "balanced" },
  { label: "Persuasivo", value: "persuasive" },
  { label: "Muy vendedor", value: "very-seller" },
];

export const PersuasionSelector = ({ value, onChange }: { value: string, onChange: (value: string | null) => void }) => {
  return <BaseSelector Icon={Megaphone} type="radio" value={value} onChange={onChange} options={options} placeholder="Selecciona una persuasión" />;
};
