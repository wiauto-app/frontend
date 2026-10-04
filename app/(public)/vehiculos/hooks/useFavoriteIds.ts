"use client";

import { useFavorites } from "@/app/contexts/favorites/useFavorites";

export const useFavoriteIds = () => {
  const { favoriteIds } = useFavorites();
  return favoriteIds;
};
