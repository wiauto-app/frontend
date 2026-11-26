"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface SortableImageTileProps {
  id: string;
  disabled?: boolean;
  /** Etiqueta accesible: posición de la foto en la galería. */
  label: string;
  className?: string;
  children: ReactNode;
}

/**
 * Celda de la galería arrastrable desde cualquier punto (ratón, táctil con
 * pulsación larga y teclado con Espacio + flechas).
 */
export const SortableImageTile = ({
  id,
  disabled = false,
  label,
  className,
  children,
}: SortableImageTileProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      {...attributes}
      {...listeners}
      aria-label={label}
      title={disabled ? undefined : "Arrastra para cambiar el orden"}
      className={cn(
        "group/photo relative aspect-square select-none overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        disabled ? "cursor-default" : "cursor-grab touch-manipulation",
        isDragging &&
          "z-20 cursor-grabbing scale-[1.03] opacity-90 shadow-lg ring-2 ring-primary",
        className,
      )}
    >
      {children}
    </li>
  );
};
