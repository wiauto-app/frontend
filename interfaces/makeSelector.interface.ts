import { ReactNode } from "react";

import type { HierarchyMultiValue } from "@/components/selectors/types";

export type HierarchySelectItem = {
  id: string | number;
  slug: string;
  label: string;
  count?: number;
};

export type PendingSelection<TItem extends HierarchySelectItem> = {
  parent: TItem;
  child?: TItem;
} | null;

type SearchableHierarchySelectBaseProps<TItem extends HierarchySelectItem> = {
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
  getItemSlug?: (item: TItem) => string;
  getChildParentSlug?: (child: TItem, parent: TItem) => string;
};

export type SearchableHierarchySelectSingleProps<
  TItem extends HierarchySelectItem,
> = SearchableHierarchySelectBaseProps<TItem> & {
  selection_mode?: "single";
  onSelectItem?: (item: TItem) => void;
  onSelectChild?: (parent: TItem, child: TItem) => void;
};

export type SearchableHierarchySelectMultipleProps<
  TItem extends HierarchySelectItem,
> = SearchableHierarchySelectBaseProps<TItem> & {
  selection_mode: "multiple";
  value: HierarchyMultiValue;
  onValueChange: (value: HierarchyMultiValue) => void;
};

export type SearchableHierarchySelectProps<TItem extends HierarchySelectItem> =
  | SearchableHierarchySelectSingleProps<TItem>
  | SearchableHierarchySelectMultipleProps<TItem>;
