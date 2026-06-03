import type { HierarchyMultiValue } from "./types";

type SlugLabelSource = {
  slug: string;
  label: string;
};

const resolveLabel = (
  slug: string,
  items?: SlugLabelSource[],
): string => {
  console.log('items', items);
  return items?.find((item) => item.slug === slug)?.label ?? slug;
}

/** Resumen legible para un selector jerárquico multi. */
export const formatHierarchyMultiDisplay = (
  value: HierarchyMultiValue,
  parents: SlugLabelSource[],
  children: SlugLabelSource[],
): string | null => {
  const parent_labels = value.parent_slugs.map((slug) =>
    resolveLabel(slug, parents),
  );
  const child_labels = value.child_slugs.map((slug) =>
    resolveLabel(slug, children),
  );

  const parts: string[] = [];

  if (parent_labels.length > 0) {
    parts.push(parent_labels.join(", "));
  }

  if (child_labels.length === 0) {
    return parts.length > 0 ? parts.join(" · ") : null;
  }

  if (child_labels.length === 1) {
    parts.push(child_labels[0]);
  } else {
    parts.push(`${child_labels[0]} +${child_labels.length - 1} más`);
  }

  return parts.join(" · ");
};


