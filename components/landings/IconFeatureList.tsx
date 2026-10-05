import type { StrapiIconFeature } from "@/interfaces/strapi-components.interface";
import { IconContainer } from "@/components/ui/iconContainer";
import {
  resolveStrapiIconName,
  type StrapiIconPack,
} from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";

interface IconFeatureListProps {
  items: StrapiIconFeature[] | null | undefined;
  iconPack: StrapiIconPack;
  /**
   * - `list`: vertical, icono a la izquierda (p. ej. "¿Cómo funciona?" en un sidebar).
   * - `strip`: franja horizontal con separadores (p. ej. franja de confianza).
   * - `grid`: icono arriba y texto centrado (p. ej. features del hero).
   */
  variant?: "list" | "strip" | "grid";
  /** Antepone el número de paso al label (`1. …`). */
  numbered?: boolean;
  className?: string;
}

/** Lista reutilizable de `shared.icon-feature` en tres disposiciones. */
export const IconFeatureList = ({
  items,
  iconPack,
  variant = "list",
  numbered = false,
  className,
}: IconFeatureListProps) => {
  if (!items?.length) {
    return null;
  }

  return (
    <ul
      className={cn(
        variant === "list" && "flex flex-col gap-4",
        variant === "strip" &&
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-200",
        variant === "grid" && "grid grid-cols-2 gap-4 sm:grid-cols-4",
        className,
      )}
    >
      {items.map((item, index) => {
        const Icon = resolveStrapiIconName(item.iconName, iconPack);
        const label = numbered ? `${index + 1}. ${item.label}` : item.label;

        if (variant === "grid") {
          return (
            <li
              key={`${index}-${item.label}`}
              className="flex flex-col items-center gap-2 text-center"
            >
              <IconContainer Icon={Icon} rounded size="lg" />
              <span className="text-sm font-medium text-slate-800">{label}</span>
            </li>
          );
        }

        return (
          <li
            key={`${index}-${item.label}`}
            className={cn("flex items-start gap-3", variant === "strip" && "lg:px-6 lg:first:pl-0")}
          >
            <IconContainer Icon={Icon} rounded size="sm" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-slate-900">{label}</span>
              {item.descripcion ? (
                <span className="text-sm text-slate-500">{item.descripcion}</span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
