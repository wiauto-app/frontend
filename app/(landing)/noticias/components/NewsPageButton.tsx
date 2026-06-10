"use client";

import type { ReactNode } from "react";
import { useNewsUrlUpdate } from "../hooks/useNewsUrlUpdate";

type NewsPageButtonProps = {
  page: number;
  isActive: boolean;
  disabled?: boolean;
  variant?: "page" | "nav";
  children: ReactNode;
  ariaLabel: string;
};

export const NewsPageButton = ({
  page,
  isActive,
  disabled = false,
  variant = "page",
  children,
  ariaLabel,
}: NewsPageButtonProps) => {
  const { searchParams, replaceParams } = useNewsUrlUpdate();

  const handleClick = () => {
    if (disabled) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    replaceParams(params);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === "nav"
          ? "border border-blue-200 text-blue-600 hover:bg-blue-50"
          : isActive
            ? "bg-blue-600 text-white"
            : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
};
