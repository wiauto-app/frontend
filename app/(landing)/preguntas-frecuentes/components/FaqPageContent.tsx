"use client";

import { useMemo, useState } from "react";

import type {
  StrapiCard,
  StrapiFaq,
} from "@/interfaces/strapi-components.interface";

import {
  FAQ_CATEGORY_ALL,
  FaqCategorySidebar,
} from "./FaqCategorySidebar";
import { FaqCategorySection } from "./FaqCategorySection";
import { groupFaqsByCategory } from "../utils/groupFaqsByCategory";

interface FaqPageContentProps {
  faqs: StrapiFaq[];
  soporte: StrapiCard | null;
}

export const FaqPageContent = ({ faqs, soporte }: FaqPageContentProps) => {
  const [selectedCategory, setSelectedCategory] = useState(FAQ_CATEGORY_ALL);

  const groups = useMemo(() => groupFaqsByCategory(faqs), [faqs]);
  const totalCount = useMemo(
    () => groups.reduce((sum, group) => sum + group.items.length, 0),
    [groups],
  );

  const visibleGroups = useMemo(() => {
    if (selectedCategory === FAQ_CATEGORY_ALL) {
      return groups;
    }

    return groups.filter((group) => group.categoria === selectedCategory);
  }, [groups, selectedCategory]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
      <FaqCategorySidebar
        groups={groups}
        totalCount={totalCount}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        soporte={soporte}
      />

      <div className="min-w-0 flex-1">
        {visibleGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No hay preguntas en esta categoría.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {visibleGroups.map((group) => (
              <FaqCategorySection key={group.categoria} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
