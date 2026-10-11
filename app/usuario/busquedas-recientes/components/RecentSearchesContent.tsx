"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { History, RotateCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { VehicleSearchHistoryItem } from "@/interfaces/vehicle-search-history.interface";
import { Button, buttonVariants } from "@/components/ui/button";
import { CustomAlertDialog } from "@/components/ui/customAlertDialog";
import { EmptyContent } from "@/components/ui/emptyContent";
import { Skeleton } from "@/components/ui/skeleton";
import { VEHICLES_LISTING_BASE_PATH } from "@/lib/vehicles/listing-url";
import { cn } from "@/lib/utils";
import { useRecentSearchesPage } from "../hooks/useRecentSearchesPage";
import { getRecentSearchLabel } from "../utils/recent-searches.utils";
import { RecentSearchRow } from "./RecentSearchRow";

const SKELETON_ROWS = 4;

const RecentSearchesSkeleton = () => (
  <div
    className="overflow-hidden rounded-xl border border-border bg-card"
    aria-busy="true"
    aria-label="Cargando búsquedas recientes"
  >
    {Array.from({ length: SKELETON_ROWS }, (_, index) => (
      <div
        key={index}
        className="flex items-center gap-3 border-b border-border px-3 py-4 last:border-b-0 sm:gap-4 sm:px-4"
      >
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 max-w-sm" />
          <Skeleton className="h-3 w-1/2 max-w-56" />
        </div>
        <Skeleton className="size-8 shrink-0 rounded-md" />
      </div>
    ))}
  </div>
);

export const RecentSearchesContent = () => {
  const {
    items,
    isLoading,
    error,
    isRefetching,
    refetch,
    removeSearch,
    clearHistory,
    isClearing,
  } = useRecentSearchesPage();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const hasItems = items.length > 0;
  const showError = !isLoading && Boolean(error) && !hasItems;

  /** Tras borrar una fila, el foco pasa a la siguiente (o la anterior) para no perderse. */
  const restoreFocus = (removedIndex: number) => {
    requestAnimationFrame(() => {
      const links =
        listRef.current?.querySelectorAll<HTMLAnchorElement>(
          "[data-recent-search-link]",
        ) ?? [];
      const target = links[Math.min(removedIndex, links.length - 1)];
      (target ?? headingRef.current)?.focus();
    });
  };

  const handleRemove = (item: VehicleSearchHistoryItem) => {
    const removedIndex = items.findIndex((entry) => entry.id === item.id);
    const label = getRecentSearchLabel(item);

    removeSearch(item.id).then(
      () => toast.success("Búsqueda eliminada del historial"),
      (mutationError: unknown) =>
        toast.error(
          mutationError instanceof Error
            ? mutationError.message
            : `No se pudo eliminar «${label}»`,
        ),
    );
    restoreFocus(removedIndex);
  };

  const handleClear = async () => {
    try {
      await clearHistory();
      toast.success("Historial de búsquedas borrado");
    } catch (clearError) {
      toast.error(
        clearError instanceof Error
          ? clearError.message
          : "No se pudo borrar el historial",
      );
    } finally {
      setIsClearDialogOpen(false);
      headingRef.current?.focus();
    }
  };

  return (
    <div className="space-y-5 pb-20">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <History className="size-6 text-gray-700" aria-hidden />
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl font-bold text-gray-900 outline-none"
            >
              Búsquedas recientes
            </h1>
          </div>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Vuelve a tus últimas búsquedas con los mismos filtros. Solo tú puedes
            verlas.
          </p>
        </div>

        {hasItems ? (
          <Button
            type="button"
            variant="outline"
            className="self-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isClearing}
            onClick={() => setIsClearDialogOpen(true)}
          >
            <Trash2 className="size-4" aria-hidden />
            Borrar historial
          </Button>
        ) : null}
      </header>

      {isLoading ? <RecentSearchesSkeleton /> : null}

      {showError ? (
        <div className="rounded-xl border border-border bg-card">
          <EmptyContent
            variant="error"
            title="No pudimos cargar tus búsquedas recientes"
            description="Revisa tu conexión e inténtalo de nuevo."
            action={
              <Button
                type="button"
                variant="outline"
                disabled={isRefetching}
                onClick={() => {
                  void refetch();
                }}
              >
                <RotateCw
                  className={cn("size-4", isRefetching && "animate-spin")}
                  aria-hidden
                />
                {isRefetching ? "Reintentando…" : "Reintentar"}
              </Button>
            }
          />
        </div>
      ) : null}

      {!isLoading && !showError && !hasItems ? (
        <div className="rounded-xl border border-dashed border-border bg-card">
          <EmptyContent
            icon={History}
            live
            title="Aún no tienes búsquedas recientes"
            description="Cuando busques vehículos con algún filtro, aparecerán aquí para que puedas retomarlas cuando quieras."
            action={
              <Link
                href={VEHICLES_LISTING_BASE_PATH}
                className={cn(buttonVariants())}
              >
                <Search className="size-4" aria-hidden />
                Buscar vehículos
              </Link>
            }
          />
        </div>
      ) : null}

      {!isLoading && hasItems ? (
        <section aria-labelledby="recent-searches-list-title">
          <h2 id="recent-searches-list-title" className="sr-only">
            Listado de búsquedas recientes
          </h2>
          <ul
            ref={listRef}
            className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
          >
            {items.map((item) => (
              <RecentSearchRow
                key={item.id}
                item={item}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Mostramos tus {items.length === 1 ? "última búsqueda" : `últimas ${items.length} búsquedas`} con filtros.
          </p>
        </section>
      ) : null}

      <CustomAlertDialog
        open={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        title="¿Borrar todo el historial?"
        description="Se eliminarán todas tus búsquedas recientes. Tus búsquedas guardadas y alertas no se verán afectadas. Esta acción no se puede deshacer."
        confirmText="Borrar historial"
        confirmVariant="destructive"
        onConfirm={handleClear}
      />
    </div>
  );
};
