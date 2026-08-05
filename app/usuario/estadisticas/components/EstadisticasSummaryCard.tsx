import type { LucideIcon } from "lucide-react";

interface EstadisticasSummaryCardProps {
  label: string;
  value: string;
  subtext?: string | null;
  icon: LucideIcon;
}

export const EstadisticasSummaryCard = ({
  label,
  value,
  subtext,
  icon: Icon,
}: EstadisticasSummaryCardProps) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 text-gray-400" aria-hidden />
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtext ? (
        <p className="text-xs font-medium text-gray-400 mt-1">{subtext}</p>
      ) : null}
    </div>
  );
};
