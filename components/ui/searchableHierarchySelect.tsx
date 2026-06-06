"use client";

import { useState, type MouseEvent } from "react";
import { ChevronDown, Loader2, Search } from "lucide-react";
import { Skeleton } from "./skeleton";
import { Popover, PopoverContent } from "./popover";
import { Input } from "./input";
import { InputButton } from "./inputButton";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CustomCheckbox } from "./customCheckbox";
import type { HierarchyMultiValue } from "@/components/selectors/types";
import {
  HierarchySelectItem,
  PendingSelection,
  SearchableHierarchySelectProps,
} from "@/interfaces/makeSelector.interface";

const formatCount = (count: number) =>
  count.toLocaleString("es-ES", { maximumFractionDigits: 0 });

type PendingMultiState = {
  parent_slugs: Set<string>;
  child_slugs: Set<string>;
};

const toMultiValue = (pending: PendingMultiState): HierarchyMultiValue => ({
  parent_slugs: [...pending.parent_slugs],
  child_slugs: [...pending.child_slugs],
});

const initPendingMulti = (value: HierarchyMultiValue): PendingMultiState => ({
  parent_slugs: new Set(value.parent_slugs),
  child_slugs: new Set(value.child_slugs),
});

const hasPendingChanges = (
  pending: PendingMultiState,
  value: HierarchyMultiValue,
): boolean => {
  const parent_match =
    pending.parent_slugs.size === value.parent_slugs.length &&
    value.parent_slugs.every((slug) => pending.parent_slugs.has(slug));
  const child_match =
    pending.child_slugs.size === value.child_slugs.length &&
    value.child_slugs.every((slug) => pending.child_slugs.has(slug));
  return !(parent_match && child_match);
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
  getItemSlug = (item) => item.slug,
  getChildParentSlug = (_child, parent) => parent.slug,
  selection_mode = "multiple",
  ...rest
}: SearchableHierarchySelectProps<TItem>) {
  const is_multiple = selection_mode === "multiple";
  const multi_props = is_multiple
    ? (rest as Extract<
        SearchableHierarchySelectProps<TItem>,
        { selection_mode: "multiple" }
      >)
    : null;
  const single_props = !is_multiple
    ? (rest as Extract<
        SearchableHierarchySelectProps<TItem>,
        { selection_mode?: "single" }
      >)
    : null;

  const [is_open, setIsOpen] = useState(false);
  const [pending_selection, setPendingSelection] =
    useState<PendingSelection<TItem>>(null);
  const [pending_multi, setPendingMulti] = useState<PendingMultiState | null>(
    null,
  );

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && is_multiple && multi_props) {
      setPendingMulti(initPendingMulti(multi_props.value));
      setPendingSelection(null);
      return;
    }
    if (!open) {
      setPendingSelection(null);
      setPendingMulti(null);
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
      single_props?.onSelectItem?.(item);
      setIsOpen(false);
    }
  };

  const handleSelectChild = (parent: TItem, child: TItem) => {
    setPendingSelection({ parent, child });
    if (!showFooterActions) {
      single_props?.onSelectChild?.(parent, child);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setPendingSelection(null);
    setPendingMulti(null);
    setIsOpen(false);
  };

  const handleAcceptSingle = () => {
    if (!pending_selection) {
      setIsOpen(false);
      return;
    }
    if (pending_selection.child) {
      single_props?.onSelectChild?.(
        pending_selection.parent,
        pending_selection.child,
      );
    } else {
      single_props?.onSelectItem?.(pending_selection.parent);
    }
    setIsOpen(false);
  };

  const handleAcceptMulti = () => {
    if (!pending_multi || !multi_props) {
      setIsOpen(false);
      return;
    }
    multi_props.onValueChange(toMultiValue(pending_multi));
    setIsOpen(false);
  };

  const handleAccept = () => {
    if (is_multiple) {
      handleAcceptMulti();
      return;
    }
    handleAcceptSingle();
  };

  const toggleParentMulti = (item: TItem) => {
    if (!pending_multi) {
      return;
    }
    const parent_slug = getItemSlug(item);
    const children = getChildren?.(item) ?? [];

    setPendingMulti((prev) => {
      if (!prev) {
        return prev;
      }
      const next_parent_slugs = new Set(prev.parent_slugs);
      const next_child_slugs = new Set(prev.child_slugs);

      if (next_parent_slugs.has(parent_slug)) {
        next_parent_slugs.delete(parent_slug);
        for (const child of children) {
          next_child_slugs.delete(getItemSlug(child));
        }
      } else {
        next_parent_slugs.add(parent_slug);
        for (const child of children) {
          next_child_slugs.delete(getItemSlug(child));
        }
      }

      return {
        parent_slugs: next_parent_slugs,
        child_slugs: next_child_slugs,
      };
    });
  };

  const toggleChildMulti = (parent: TItem, child: TItem) => {
    if (!pending_multi) {
      return;
    }
    const parent_slug = getItemSlug(parent);
    const child_slug = getItemSlug(child);

    setPendingMulti((prev) => {
      if (!prev) {
        return prev;
      }
      if (prev.parent_slugs.has(parent_slug)) {
        return prev;
      }

      const next_child_slugs = new Set(prev.child_slugs);
      if (next_child_slugs.has(child_slug)) {
        next_child_slugs.delete(child_slug);
      } else {
        next_child_slugs.add(child_slug);
      }

      return {
        parent_slugs: prev.parent_slugs,
        child_slugs: next_child_slugs,
      };
    });
  };

  const isParentCheckedMulti = (item: TItem) =>
    pending_multi?.parent_slugs.has(getItemSlug(item)) ?? false;

  const isParentIndeterminateMulti = (item: TItem) => {
    if (!pending_multi || isParentCheckedMulti(item)) {
      return false;
    }
    const children = getChildren?.(item) ?? [];
    return children.some((child) =>
      pending_multi.child_slugs.has(getItemSlug(child)),
    );
  };

  const isChildCheckedMulti = (parent: TItem, child: TItem) => {
    if (!pending_multi) {
      return false;
    }
    return (
      pending_multi.parent_slugs.has(getItemSlug(parent)) ||
      pending_multi.child_slugs.has(getItemSlug(child))
    );
  };

  const isPendingParent = (item: TItem) =>
    pending_selection?.parent.id === item.id && !pending_selection.child;

  const isPendingChild = (parent: TItem, child: TItem) =>
    pending_selection?.parent.id === parent.id &&
    pending_selection.child?.id === child.id;

  const accept_disabled = is_multiple
    ? !pending_multi ||
      !multi_props ||
      !hasPendingChanges(pending_multi, multi_props.value)
    : !pending_selection;

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
            <Input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoFocus
              className="h-12 rounded-full pr-4 pl-12"
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
              const parent_checked = isParentCheckedMulti(item);
              const parent_indeterminate = isParentIndeterminateMulti(item);

              return (
                <div key={item.id} className="flex flex-col">
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                      (pending_parent || parent_checked) && "bg-muted/80",
                    )}
                  >
                    {renderItemLeading?.(item)}
                    {is_multiple ? (
                      <CustomCheckbox
                        checked={parent_checked}
                        indeterminate={parent_indeterminate}
                        onChange={() => toggleParentMulti(item)}
                        aria-label={`Seleccionar ${item.label}`}
                      />
                    ) : null}
                    <button
                      type="button"
                      role="option"
                      aria-selected={
                        is_multiple ? parent_checked : pending_parent
                      }
                      className="flex min-h-10 min-w-0 flex-1 items-center justify-between gap-4 text-left outline-none"
                      onClick={() =>
                        is_multiple
                          ? toggleParentMulti(item)
                          : handleSelectParent(item)
                      }
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
                        aria-label={`Ver opciones de ${item.label}`}
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
                          Cargando…
                        </div>
                      ) : children.length === 0 ? (
                        <p className="px-2 py-3 text-sm text-muted-foreground">
                          Sin resultados
                        </p>
                      ) : (
                        children.map((child) => {
                          const pending_child = isPendingChild(item, child);
                          const child_checked = isChildCheckedMulti(
                            item,
                            child,
                          );
                          const child_parent_slug = getChildParentSlug(
                            child,
                            item,
                          );

                          return (
                            <div
                              key={child.id}
                              role="option"
                              aria-selected={
                                is_multiple ? child_checked : pending_child
                              }
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-3 text-left text-base font-medium outline-none hover:bg-muted focus-visible:bg-muted",
                                (pending_child || child_checked) &&
                                  "bg-muted/80",
                              )}
                              onClick={() =>
                                is_multiple
                                  ? toggleChildMulti(item, child)
                                  : handleSelectChild(item, child)
                              }
                              onKeyDown={(event) => {
                                if (
                                  event.key === "Enter" ||
                                  event.key === " "
                                ) {
                                  event.preventDefault();
                                  if (is_multiple) {
                                    toggleChildMulti(item, child);
                                  } else {
                                    handleSelectChild(item, child);
                                  }
                                }
                              }}
                              tabIndex={0}
                            >
                              {is_multiple ? (
                                <CustomCheckbox
                                  checked={child_checked}
                                  disabled={parent_checked}
                                  onChange={() =>
                                    toggleChildMulti(item, child)
                                  }
                                  aria-label={`Seleccionar ${child.label}`}
                                />
                              ) : null}
                              <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                                <span className="truncate">{child.label}</span>
                                {child.count !== undefined ? (
                                  <span className="shrink-0 text-base font-medium text-muted-foreground tabular-nums">
                                    {formatCount(child.count)}
                                  </span>
                                ) : null}
                              </div>
                              <span className="sr-only">
                                {child_parent_slug}
                              </span>
                            </div>
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
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAccept}
              disabled={accept_disabled}
            >
              Aceptar
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
