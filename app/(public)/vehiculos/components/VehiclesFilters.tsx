import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filtersService } from "../[[...slug]]/services/filtersService";

import { VehiclesFiltersPanel } from "./VehiclesFiltersPanel";

export const VehiclesFilters = async () => {
  const catalog = await filtersService.getFilters();
  return (
    <Card size="sm" >
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
       
        <VehiclesFiltersPanel catalog={catalog} />
      </CardContent>
    </Card>
  );
};
