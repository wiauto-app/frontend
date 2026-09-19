"use client";

import { Button } from "@/components/ui/button";
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
    <Button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      aria-label={`Filtrar por ${label}`}
      variant={isActive ? "default" : "outline"}
      size="sm"
      className="shrink-0 rounded-full"
    >
      {label}
    </Button>
  );
};
