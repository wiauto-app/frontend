import type { ReactNode } from "react";

import { DealershipVehiclesFiltersSheet } from "./DealershipVehiclesFiltersSheet";

type DealerVehiclesSectionProps = {
  total: number;
  filtersNode: ReactNode;
  title: string;
};

export function DealerVehiclesSection({
  total,
  filtersNode,
  title,
}: DealerVehiclesSectionProps) {
  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-slate-500">{total} en inventario</p>
          <DealershipVehiclesFiltersSheet filtersNode={filtersNode} />
        </div>
      </div>
    </div>
  );
}
