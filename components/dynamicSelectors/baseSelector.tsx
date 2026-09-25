import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BaseSelectProps<T> {
  items: T[];
  value?: string;
  onChange: (value: string | undefined) => void;
  labelKey: keyof T;
  valueKey: keyof T;
  placeholder?: string;
  triggerClassName?: string;
  contentClassName?: string;
  /** Texto del ítem deshabilitado cuando `items` está vacío */
  emptyLabel?: string;
  /** Contenido de cada opción. Si no se pasa, se usa `labelKey`. */
  renderItem?: (item: T) => ReactNode;
  /**
   * Acciones a la derecha de cada opción (editar, eliminar, menú, etc.).
   * Usa `type="button"` y, si hace falta, `onPointerDown={(e) => e.stopPropagation()}` en controles interactivos.
   */
  renderItemTrailing?: (item: T) => ReactNode;
  /** Contenido bajo la lista (por ejemplo botón “Nuevo”) */
  renderFooter?: () => ReactNode;
  /**
   * Atajo: si `create` es true y existe `onCreate`, se muestra un botón estándar al pie.
   * Preferible usar `renderFooter` para composición completa.
   */
  showExtraActions?: {
    create?: boolean;
    delete?: boolean;
    update?: boolean;
    read?: boolean;
  };
  onCreate?: () => void;
  disabled?: boolean;
  align?: "start" | "center" | "end";
}

export function BaseSelector<T>({
  items,
  value,
  onChange,
  labelKey,
  valueKey,
  placeholder,
  triggerClassName,
  contentClassName,
  emptyLabel,
  renderItem,
  renderItemTrailing,
  renderFooter,
  showExtraActions,
  onCreate,
  disabled = false,
  align = "start",
}: BaseSelectProps<T>) {
  const resolvedPlaceholder = placeholder ?? "Seleccionar";
  const resolvedEmptyLabel = emptyLabel ?? "No hay datos";

  const showLegacyCreate =
    Boolean(showExtraActions?.create && onCreate && !renderFooter);

  const selectItems = useMemo(
    () =>
      items.map((item) => ({
        label: String(item[labelKey]),
        value: String(item[valueKey]),
      })),
    [items, labelKey, valueKey],
  );

  /**
   * Base UI limpia el valor con `null` si no está entre las opciones.
   * Hay que mantener el select controlado (`null`, no `undefined`) y no
   * notificar al padre si el valor no cambió: si no, `setValue` re-renderiza
   * y el layout effect vuelve a disparar `onValueChange` en bucle.
   */
  const resolvedSelectValue = useMemo(() => {
    const raw = typeof value === "string" ? value.trim() : "";
    if (!raw || selectItems.length === 0) return null;
    const exists = selectItems.some((item) => item.value === raw);
    return exists ? raw : null;
  }, [value, selectItems]);

  const handleValueChange = (nextValue: string | null) => {
    const normalized = nextValue ?? undefined;
    const current = typeof value === "string" ? value : undefined;

    if (normalized === current) return;
    if (!normalized && !current) return;

    onChange(normalized);
  };

  const handleCreateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onCreate?.();
  };

  return (
    <Select
      value={resolvedSelectValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      items={selectItems}
    >
      <SelectTrigger className={cn("min-w-0 w-full", triggerClassName)}>
        <SelectValue placeholder={resolvedPlaceholder} />
      </SelectTrigger>

      <SelectContent align={align} className={cn("max-h-[240px] overflow-y-auto", contentClassName)}>
        
        {items.length === 0 ? (
          <SelectItem value="__empty__" disabled className="opacity-70">
            {resolvedEmptyLabel}
          </SelectItem>
        ) : (
          items.map((item) => {
            const itemValue = String(item[valueKey]);
            const trailing = renderItemTrailing?.(item);
            const itemContent = renderItem?.(item) ?? String(item[labelKey]);

            if (trailing) {
              return (
                <div
                  key={itemValue}
                  className="flex min-w-0 w-full items-center gap-1 pr-1"
                >
                  <SelectItem value={itemValue} className="min-w-0 flex-1">
                    <span className="truncate">{itemContent}</span>
                  </SelectItem>
                  <div className="flex shrink-0 items-center gap-0.5">{trailing}</div>
                </div>
              );
            }

            return (
              <SelectItem key={itemValue} value={itemValue}>
                {itemContent}
              </SelectItem>
            );
          })
        )}

        {renderFooter?.()}

        {showLegacyCreate ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-1 h-8 w-full"
            onClick={handleCreateClick}
          >
            <Plus className="mr-1 h-4 w-4" aria-hidden />
            Crear
          </Button>
        ) : null}
      </SelectContent>
    </Select>
  );
}
