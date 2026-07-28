import { Skeleton } from "@/components/ui/skeleton";

export const EstadisticasSkeleton = () => (
  <div className="space-y-6 pb-20" aria-busy="true" aria-label="Cargando estadísticas">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-9 w-64" />
    </div>

    <div className="space-y-3">
      <Skeleton className="h-5 w-24" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>

    <Skeleton className="h-72 rounded-xl" />
  </div>
);
