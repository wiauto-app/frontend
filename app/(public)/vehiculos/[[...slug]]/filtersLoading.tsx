import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const FILTER_SECTION_COUNT = 8;

export const FiltersLoading = () => {
  return (
    <Card
      className="rounded-none"
      size="sm"
      aria-busy="true"
      aria-label="Cargando filtros"
    >
      <CardHeader>
        <Skeleton className="h-5 w-20" />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid max-h-68 grid-cols-3 gap-1 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-sm" />
          ))}
        </div>

        {Array.from({ length: FILTER_SECTION_COUNT }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 py-2">
              <Skeleton className="size-6 shrink-0 rounded-sm" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-9 w-full" />
            {index < FILTER_SECTION_COUNT - 1 ? <Separator /> : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
