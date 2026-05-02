"use client";

import { useContext } from "react";
import { AuthContext } from "./authContext";

export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useUser debe usarse dentro de un AuthProvider");
  }

  return context;
};
