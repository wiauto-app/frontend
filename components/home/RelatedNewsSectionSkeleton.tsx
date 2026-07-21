import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "./SectionContainer";

export const RelatedNewsSectionSkeleton = () => (
  <SectionContainer aria-busy="true" aria-label="Cargando novedades">
    <div className="mb-5 flex items-center justify-between">
      <Skeleton className="h-7 w-72 sm:h-8 sm:w-96" />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[minmax(180px,1fr)] lg:max-h-96">
      <Skeleton className="min-h-[220px] w-full rounded-lg sm:min-h-[260px] lg:col-span-2 lg:min-h-0 lg:h-full" />
      <Skeleton className="aspect-4/5 w-full rounded-lg lg:aspect-auto lg:h-full" />
      <Skeleton className="aspect-4/5 w-full rounded-lg lg:aspect-auto lg:h-full" />
      <Skeleton className="aspect-4/5 w-full rounded-lg sm:col-span-2 lg:col-span-1 lg:aspect-auto lg:h-full" />
    </div>
  </SectionContainer>
);
