"use client";

import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import { StrapiButton } from "@/components/ui/strapiButton";
import type { StrapiCard } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";
import { HiOutlineCollection, HiOutlineSupport } from "react-icons/hi";

import type { FaqCategoryGroup } from "../utils/groupFaqsByCategory";

export const FAQ_CATEGORY_ALL = "__all__";

interface FaqCategorySidebarProps {
  groups: FaqCategoryGroup[];
  totalCount: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  soporte: StrapiCard | null;
}

export const FaqCategorySidebar = ({
  groups,
  totalCount,
  selectedCategory,
  onSelectCategory,
  soporte,
}: FaqCategorySidebarProps) => {
  return (
    <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:max-w-64 lg:shrink-0">
      <nav
        aria-label="Categorías de preguntas frecuentes"
        className="rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs"
      >
        <ul className="flex flex-col gap-0.5">
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory(FAQ_CATEGORY_ALL)}
              aria-pressed={selectedCategory === FAQ_CATEGORY_ALL}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                selectedCategory === FAQ_CATEGORY_ALL
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <HiOutlineCollection className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">
                Todas las preguntas
              </span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                  selectedCategory === FAQ_CATEGORY_ALL
                    ? "bg-primary/15 text-primary"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                {totalCount}
              </span>
            </button>
          </li>

          {groups.map((group) => {
            const Icon =
              resolveStrapiIconName(group.iconName) ?? HiOutlineCollection;
            const isActive = selectedCategory === group.categoria;

            return (
              <li key={group.categoria}>
                <button
                  type="button"
                  onClick={() => onSelectCategory(group.categoria)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">
                    {group.categoria}
                  </span>
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {group.items.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {soporte ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HiOutlineSupport className="size-5" aria-hidden />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {soporte.titulo ?? "¿No encuentras lo que buscas?"}
          </h2>
          {soporte.descripcion ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {soporte.descripcion}
            </p>
          ) : null}
          {soporte.boton ? (
            <div className="mt-4">
              <StrapiButton
                button={soporte.boton}
                className="w-full justify-center"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
};
