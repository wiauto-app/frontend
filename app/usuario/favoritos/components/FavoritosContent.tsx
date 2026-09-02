"use client";

import { Heart, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateListDialog } from "./CreateListDialog";
import { FavoriteVehicleCard } from "./FavoriteVehicleCard";
import { FavoritesFolderStrip } from "./FavoritesFolderStrip";
import { FavoritesPageHeader } from "./FavoritesPageHeader";
import { useFavoritesPage } from "../hooks/useFavoritesPage";

const buildPageNumbers = (currentPage: number, totalPages: number): number[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }
  if (currentPage < totalPages) {
    pages.add(currentPage + 1);
  }

  return [...pages].sort((a, b) => a - b);
};

export const FavoritosContent = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    lists,
    items,
    total,
    page,
    totalPages,
    selectedListId,
    selectedList,
    itemCounts,
    isLoadingLists,
    isLoadingItems,
    isFetchingItems,
    listsError,
    itemsError,
    setSelectedListId,
    setPage,
    createList,
    isCreatingList,
    updateList,
    isUpdatingList,
    removeList,
    isRemovingList,
    removeItem,
    moveItem,
    copyItem,
    isMovingOrCopying,
  } = useFavoritesPage();

  const pageNumbers = useMemo(
    () => buildPageNumbers(page, totalPages),
    [page, totalPages],
  );

  const handleCreateList = async (values: {
    name: string;
    description?: string;
  }) => {
    try {
      await createList(values);
      toast.success("Carpeta creada correctamente");
    } catch {
      toast.error("No se pudo crear la carpeta");
    }
  };

  const handleRenameList = async (listId: string, name: string) => {
    try {
      await updateList({ listId, name });
      toast.success("Carpeta renombrada");
    } catch {
      toast.error("No se pudo renombrar la carpeta");
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await removeList(listId);
      toast.success("Carpeta eliminada");
    } catch {
      toast.error("No se pudo eliminar la carpeta");
    }
  };

  const handleRemoveItem = async (vehicleId: string) => {
    if (!selectedListId) {
      return;
    }
    await removeItem({ listId: selectedListId, vehicleId });
  };

  const handleMoveItem = async (vehicleId: string, targetListId: string) => {
    if (!selectedListId) {
      return;
    }
    await moveItem(selectedListId, targetListId, vehicleId);
  };

  const handleCopyItem = async (vehicleId: string, targetListId: string) => {
    await copyItem(targetListId, vehicleId);
  };

  const showPagination = total > 0 && totalPages > 1;

  return (
    <div className="space-y-8 pb-20">
      <FavoritesPageHeader onCreateFolder={() => setCreateDialogOpen(true)} />

      {listsError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          No se pudieron cargar tus carpetas de favoritos.
        </div>
      ) : (
        <FavoritesFolderStrip
          lists={lists}
          selectedListId={selectedListId}
          itemCounts={itemCounts}
          isLoading={isLoadingLists}
          onSelectList={setSelectedListId}
          onRenameList={handleRenameList}
          onDeleteList={handleDeleteList}
          isUpdatingList={isUpdatingList}
          isDeletingList={isRemovingList}
        />
      )}

      <section aria-labelledby="favorites-list-heading">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="favorites-list-heading" className="text-lg font-semibold text-gray-900">
            {selectedList
              ? `Vehículos en "${selectedList.name}"`
              : "Vehículos guardados"}
          </h2>
          {total > 0 && (
            <p className="text-sm text-gray-500">
              {total} {total === 1 ? "vehículo" : "vehículos"}
            </p>
          )}
        </div>

        {itemsError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            No se pudieron cargar los vehículos de esta carpeta.
          </div>
        ) : isLoadingItems ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        ) : !items.length ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
            <Heart className="mb-3 size-10 text-gray-300" aria-hidden />
            <p className="text-base font-medium text-gray-900">
              {selectedList
                ? `No hay vehículos en "${selectedList.name}"`
                : "No hay vehículos guardados"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Guarda anuncios desde el listado para verlos aquí.
            </p>
          </div>
        ) : (
          <div className="relative space-y-4">
            {isFetchingItems && !isLoadingItems && (
              <div className="absolute right-0 top-0 flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Actualizando
              </div>
            )}

            {items.map((item) => (
              <FavoriteVehicleCard
                key={item.id}
                item={item}
                lists={lists}
                currentListId={selectedListId ?? ""}
                itemCounts={itemCounts}
                onRemove={handleRemoveItem}
                onMove={handleMoveItem}
                onCopy={handleCopyItem}
                disabled={isMovingOrCopying}
              />
            ))}

            {showPagination && (
              <div className="flex flex-col items-center gap-3 pt-2">
                <p className="text-sm text-gray-500">
                  Página {page} de {totalPages}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        disabled={page <= 1 || isFetchingItems}
                        onClick={() => setPage(page - 1)}
                      />
                    </PaginationItem>

                    {pageNumbers.map((pageNumber, index) => {
                      const previousPage = pageNumbers[index - 1];
                      const showEllipsis =
                        previousPage !== undefined &&
                        pageNumber - previousPage > 1;

                      return (
                        <span key={pageNumber} className="contents">
                          {showEllipsis ? (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : null}
                          <PaginationItem>
                            <PaginationLink
                              isActive={pageNumber === page}
                              disabled={isFetchingItems}
                              onClick={() => setPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        </span>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        disabled={page >= totalPages || isFetchingItems}
                        onClick={() => setPage(page + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </section>

      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateList}
        isSubmitting={isCreatingList}
      />
    </div>
  );
};
