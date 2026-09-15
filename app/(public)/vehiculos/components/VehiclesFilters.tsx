import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filtersService } from "../[[...slug]]/services/filtersService";

import { VehiclesFiltersPanel } from "./VehiclesFiltersPanel";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

export const VehiclesFilters = async ({
  className,
}: {
  className?: string;
}) => {
  const catalog = await filtersService.getFilters();
  return (
    <Card size="sm" className={cn("rounded-3xl", className)}>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Suspense>
          <VehiclesFiltersPanel catalog={catalog} />
        </Suspense>
      </CardContent>
    </Card>
  );
};
