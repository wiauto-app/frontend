"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Popover, PopoverContent } from "./popover";
import { InputButton } from "./inputButton";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export type HierarchySelectItem = {
  id: string | number;
  label: string;
  count?: number;
};

type PendingSelection<TItem extends HierarchySelectItem> = {
  parent: TItem;
  child?: TItem;
} | null;

export type SearchableHierarchySelectProps<TItem extends HierarchySelectItem> =
  {
    label: string;
    placeholder?: string;
    searchPlaceholder?: string;
    listTitle?: string;
    items: TItem[];
    isLoading?: boolean;
    searchValue: string;
    onSearchChange: (value: string) => void;
    displayValue?: string | null;
    emptyMessage?: string;
    showFooterActions?: boolean;
    renderItemLeading?: (item: TItem) => ReactNode;
    isItemExpandable?: (item: TItem) => boolean;
    isItemExpanded?: (item: TItem) => boolean;
    isLoadingChildren?: (item: TItem) => boolean;
    getChildren?: (item: TItem) => TItem[] | undefined;
    onExpandItem?: (item: TItem) => void;
    onSelectItem?: (item: TItem) => void;
    onSelectChild?: (parent: TItem, child: TItem) => void;
  };

const formatCount = (count: number) =>
  count.toLocaleString("es-ES", { maximumFractionDigits: 0 });

const DefaultItemLeading = ({ label }: { label: string }) => {
  const initials = label.trim().slice(0, 2).toUpperCase();
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold tracking-wide text-muted-foreground"
      aria-hidden
    >
      {initials}
    </span>
  );
};

export function SearchableHierarchySelect<TItem extends HierarchySelectItem>({
  label,
  placeholder = "Selecciona una opción",
  searchPlaceholder = "Buscar…",
  listTitle = "Marcas más populares",
  items,
  isLoading = false,
  searchValue,
  onSearchChange,
  displayValue,
  emptyMessage = "No hay resultados",
  showFooterActions = true,
  renderItemLeading,
  isItemExpandable,
  isItemExpanded,
  isLoadingChildren,
  getChildren,
  onExpandItem,
  onSelectItem,
  onSelectChild,
}: SearchableHierarchySelectProps<TItem>) {
  const [is_open, setIsOpen] = useState(false);
  const [pending_selection, setPendingSelection] =
    useState<PendingSelection<TItem>>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setPendingSelection(null);
    }
  };

  const handleToggleExpand = (
    item: TItem,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    onExpandItem?.(item);
  };

  const handleSelectParent = (item: TItem) => {
    setPendingSelection({ parent: item });
    if (!showFooterActions) {
      onSelectItem?.(item);
      setIsOpen(false);
    }
  };

  const handleSelectChild = (parent: TItem, child: TItem) => {
    setPendingSelection({ parent, child });
    if (!showFooterActions) {
      onSelectChild?.(parent, child);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setPendingSelection(null);
    setIsOpen(false);
  };

  const handleAccept = () => {
    if (!pending_selection) {
      setIsOpen(false);
      return;
    }
    if (pending_selection.child) {
      onSelectChild?.(pending_selection.parent, pending_selection.child);
    } else {
      onSelectItem?.(pending_selection.parent);
    }
    setIsOpen(false);
  };

  const isPendingParent = (item: TItem) =>
    pending_selection?.parent.id === item.id && !pending_selection.child;

  const isPendingChild = (parent: TItem, child: TItem) =>
    pending_selection?.parent.id === parent.id &&
    pending_selection.child?.id === child.id;

  if (isLoading && items.length === 0) {
    return (
      <div className="relative">
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <Popover open={is_open} onOpenChange={handleOpenChange}>
      <InputButton
        asPopoverTrigger
        label={label}
        className={cn(
          "h-11 text-start text-base",
          displayValue ? "text-foreground" : undefined,
        )}
        aria-expanded={is_open}
        aria-haspopup="listbox"
      >
        {displayValue ?? placeholder}
      </InputButton>
      <PopoverContent
        align="start"
        sideOffset={8}
        className={cn(
          "flex w-[min(100vw-1.5rem,28rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-xl ring-1 ring-foreground/10",
        )}
        role="dialog"
        aria-label={label}
      >
        <div className="border-b border-border px-4 pb-4 pt-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoFocus
              className="h-12 w-full rounded-full border border-foreground/20 bg-background pr-4 pl-12 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
          {listTitle ? (
            <p className="mt-4 text-base font-bold text-foreground">
              {listTitle}
            </p>
          ) : null}
        </div>

        <div
          className="max-h-[min(22rem,50vh)] overflow-y-auto overscroll-contain px-2 py-2"
          role="listbox"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-base text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-hidden />
              Cargando…
            </div>
          ) : items.length === 0 ? (
            <p className="px-4 py-10 text-center text-base text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            items.map((item) => {
              const expandable = isItemExpandable?.(item) ?? false;
              const expanded = isItemExpanded?.(item) ?? false;
              const children = getChildren?.(item) ?? [];
              const loading_children = isLoadingChildren?.(item) ?? false;
              const pending_parent = isPendingParent(item);

              return (
                <div key={item.id} className="flex flex-col">
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                      pending_parent && "bg-muted/80",
                    )}
                  >
                    {renderItemLeading?.(item) ?? (
                      <DefaultItemLeading label={item.label} />
                    )}
                    <button
                      type="button"
                      role="option"
                      aria-selected={pending_parent}
                      className="flex min-h-10 min-w-0 flex-1 items-center justify-between gap-4 text-left outline-none"
                      onClick={() => handleSelectParent(item)}
                    >
                      <span className="truncate text-base font-bold tracking-wide text-foreground uppercase">
                        {item.label}
                      </span>
                      {item.count !== undefined ? (
                        <span className="shrink-0 text-base font-medium text-muted-foreground tabular-nums">
                          {formatCount(item.count)}
                        </span>
                      ) : null}
                    </button>
                    {expandable ? (
                      <button
                        type="button"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full outline-none hover:bg-muted focus-visible:bg-muted"
                        aria-expanded={expanded}
                        aria-label={`Ver modelos de ${item.label}`}
                        onClick={(event) => handleToggleExpand(item, event)}
                      >
                        <ChevronDown
                          className={cn(
                            "size-5 text-foreground transition-transform duration-200",
                            expanded && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                    ) : (
                      <span className="size-10 shrink-0" aria-hidden />
                    )}
                  </div>
                  {expandable && expanded ? (
                    <div className="mb-2 ml-14 flex flex-col gap-0.5 border-l-2 border-border pl-4">
                      {loading_children ? (
                        <div className="flex items-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                          <Loader2
                            className="size-4 animate-spin"
                            aria-hidden
                          />
                          Cargando modelos…
                        </div>
                      ) : children.length === 0 ? (
                        <p className="px-2 py-3 text-sm text-muted-foreground">
                          Sin modelos
                        </p>
                      ) : (
                        children.map((child) => {
                          const pending_child = isPendingChild(item, child);
                          return (
                            <button
                              key={child.id}
                              type="button"
                              role="option"
                              aria-selected={pending_child}
                              className={cn(
                                "rounded-lg px-3 py-3 text-left text-base font-medium outline-none hover:bg-muted focus-visible:bg-muted",
                                pending_child && "bg-muted/80",
                              )}
                              onClick={() => handleSelectChild(item, child)}
                            >
                              <div className="flex items-center justify-between">{child.label} <span>{child.count}</span></div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {showFooterActions ? (
          <div className="flex items-center justify-end gap-3 border-t border-border px-4 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAccept}
              disabled={!pending_selection}
            >
              Aceptar
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
