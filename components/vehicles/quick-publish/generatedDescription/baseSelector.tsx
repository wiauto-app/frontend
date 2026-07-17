import { IconContainer } from "@/components/ui/iconContainer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideIcon } from "lucide-react";

export const BaseSelector = ({
  value,
  onChange,
  options,
  placeholder,
  type = "select",
  Icon,
}: {
  value: string;
  onChange: (value: string | null) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  type?: "select" | "radio";
  Icon: LucideIcon;
}) => {
  if (type === "select") {
    return (
      <Select value={value} onValueChange={onChange} items={options}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  if (type === "radio") {
    return (
      <div className="flex flex-col gap-2">
        <Label>
          <IconContainer Icon={Icon}/>
          {placeholder}
        </Label>
        <RadioGroup className="pl-14" value={value} onValueChange={onChange}>
          {options.map((option) => (
            <div className="flex items-center gap-3" key={option.value}>
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer">{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
};
