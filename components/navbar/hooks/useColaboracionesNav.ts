'use client';

import { useEffect, useState } from "react";
import type { NavLink } from "../constants/navLinks.constants";

/**
 * Client hook para fetch colaboraciones dinámicas y convertirlas a NavLinks.
 * Ejecuta fetch en mount con cache vía useState.
 *
 * IMPORTANTE: Este hook ejecuta en CLIENT. Para server, usa getAllColaboraciones() directamente.
 */
export const useColaboracionesNav = (): NavLink[] => {
  const [items, setItems] = useState<NavLink[]>([]);

  useEffect(() => {
    const fetchColaboraciones = async () => {
      try {
        // Import de forma lazy para evitar circular dependencies
        const { getAllColaboraciones } = await import(
          "@/app/(landing)/colaboraciones/services/getAllColaboraciones"
        );

        const colaboraciones = await getAllColaboraciones();

        const navItems: NavLink[] = colaboraciones.map((col) => ({
          href: `/colaboraciones/${col.nombre}`,
          label: col.nombre,
        }));

        setItems(navItems);
      } catch (error) {
        console.error("[useColaboracionesNav] Error fetching:", error);
        setItems([]);
      }
    };

    fetchColaboraciones();
  }, []);

  return items;
};
