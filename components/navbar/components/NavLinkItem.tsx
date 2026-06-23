"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { BRAND_BLUE } from "../constants/navLinks.constants";

export type NavLinkVariant = "desktop" | "mobile";

type NavLinkItemProps = {
  href: string;
  label: string;
  isActive: boolean;
  variant: NavLinkVariant;
  onNavigate?: () => void;
};

export const getNavLinkItemClassName = (
  variant: NavLinkVariant,
  isActive: boolean,
): string => {
  if (variant === "mobile") {
    return cn(
      "flex min-h-11 w-full items-center border-b border-slate-100 px-1 py-3 text-base font-semibold text-slate-900 transition-colors duration-200 hover:text-[#0061F2]",
      isActive && "text-[#0061F2]",
    );
  }

  return cn(
    "relative inline-flex items-center text-sm font-semibold text-slate-900 transition-colors duration-200 hover:text-[#0061F2]",
    "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0061F2] after:transition-transform after:duration-200 hover:after:scale-x-100",
    isActive && "text-[#0061F2] after:scale-x-100",
  );
};

export const NavLinkItem = ({
  href,
  label,
  isActive,
  variant,
  onNavigate,
}: NavLinkItemProps) => {
  const handleClick = () => {
    onNavigate?.();
  };

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={getNavLinkItemClassName(variant, isActive)}
        style={isActive ? { color: BRAND_BLUE } : undefined}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={getNavLinkItemClassName(variant, isActive)}
      style={isActive ? { color: BRAND_BLUE } : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </Link>
  );
};
