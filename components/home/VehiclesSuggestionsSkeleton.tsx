import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";

const PLACEHOLDER_COUNT = 4;

export const VehiclesSuggestionsSkeleton = () => (
  <SectionContainer aria-busy="true" aria-label="Cargando vehículos destacados">
    <div className="mb-5 flex items-center justify-between">
      <Skeleton className="h-7 w-48 sm:h-8 sm:w-64" />
    </div>

    <div className="relative w-full px-10 sm:px-12">
      <div className="-ml-3 flex pb-2 sm:-ml-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <div
            key={index}
            className="basis-full shrink-0 pl-3 sm:basis-1/2 sm:pl-4 lg:basis-1/4"
          >
            <div className="flex flex-col gap-2 rounded-xl bg-muted-foreground/10 p-0 pt-0">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-2 p-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </SectionContainer>
);
