import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";

const PLACEHOLDER_COUNT = 4;

export const ZonesSkeleton = () => (
  <SectionContainer aria-busy="true" aria-label="Cargando zonas">
    <div className="mb-5 flex items-center justify-between">
      <Skeleton className="h-7 w-64 sm:h-8 sm:w-80" />
    </div>

    <div className="relative w-full px-10 sm:px-12">
      <div className="-ml-3 flex sm:-ml-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
          <div
            key={index}
            className="basis-[78%] shrink-0 pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/4"
          >
            <Skeleton className="aspect-5/4 w-full rounded-2xl sm:aspect-4/3" />
          </div>
        ))}
      </div>
    </div>
  </SectionContainer>
);
