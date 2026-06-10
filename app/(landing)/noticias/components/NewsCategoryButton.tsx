"use client";

import { useNewsUrlUpdate } from "../hooks/useNewsUrlUpdate";

type NewsCategoryButtonProps = {
  slug: string | null;
  label: string;
  isActive: boolean;
};

export const NewsCategoryButton = ({
  slug,
  label,
  isActive,
}: NewsCategoryButtonProps) => {
  const { searchParams, replaceParams } = useNewsUrlUpdate();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }

    params.delete("page");
    replaceParams(params);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      aria-label={`Filtrar por ${label}`}
      className={`flex-shrink-0 rounded border px-5 py-1.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
          : "border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  );
};
