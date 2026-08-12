import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filtersService } from "../[[...slug]]/services/filtersService";

import { VehiclesFiltersPanel } from "./VehiclesFiltersPanel";
import { Suspense } from "react";

export const VehiclesFilters = async () => {
  const catalog = await filtersService.getFilters();
  return (
    <Card size="sm" className="rounded-3xl">
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
