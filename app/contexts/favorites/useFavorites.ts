"use client";

import { useContext } from "react";

import { FavoritesContext } from "./favoritesContext";

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (context === null) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  }

  return context;
};
