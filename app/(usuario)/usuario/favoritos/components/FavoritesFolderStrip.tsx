"use client";

import type { VehicleList } from "@/interfaces/vehicle-list.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoritesFolderCard } from "./FavoritesFolderCard";

type FavoritesFolderStripProps = {
  lists: VehicleList[];
  selectedListId: string | null;
  itemCounts: Record<string, number>;
  isLoading?: boolean;
  onSelectList: (listId: string) => void;
  onRenameList: (listId: string, name: string) => Promise<void>;
  onDeleteList: (listId: string) => Promise<void>;
  isUpdatingList?: boolean;
  isDeletingList?: boolean;
};

export const FavoritesFolderStrip = ({
  lists,
  selectedListId,
  itemCounts,
  isLoading = false,
  onSelectList,
  onRenameList,
  onDeleteList,
  isUpdatingList = false,
  isDeletingList = false,
}: FavoritesFolderStripProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-56 shrink-0 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!lists.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
        No tienes carpetas de favoritos todavía.
      </div>
    );
  }

  return (
    <div className="scrollbar-hide flex gap-4 overflow-x-auto p-2">
      {lists.map((list) => (
        <FavoritesFolderCard
          key={list.id}
          list={list}
          itemCount={itemCounts[list.id] ?? 0}
          isActive={list.id === selectedListId}
          onSelect={onSelectList}
          onRename={onRenameList}
          onDelete={onDeleteList}
          isUpdating={isUpdatingList}
          isDeleting={isDeletingList}
        />
      ))}
    </div>
  );
};
