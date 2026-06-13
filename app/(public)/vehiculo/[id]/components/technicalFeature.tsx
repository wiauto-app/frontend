import { LucideIcon } from "lucide-react";

export const TechnicalFeature = ({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="p-3 bg-primary/10 rounded-md"><Icon className="size-6 shrink-0 text-primary" aria-hidden /></div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm text-foreground font-medium">{value}</span>
      </div>
    </div>
  );
};
