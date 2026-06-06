"use client";

import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

type FavoritesPageHeaderProps = {
  onCreateFolder: () => void;
};

export const FavoritesPageHeader = ({ onCreateFolder }: FavoritesPageHeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LayoutGrid className="size-6 text-gray-700" aria-hidden />
        <h1 className="text-2xl font-bold text-gray-900">Favoritos</h1>
      </div>
      <Button type="button" onClick={onCreateFolder}>
        Nueva carpeta
      </Button>
    </div>
  );
};
