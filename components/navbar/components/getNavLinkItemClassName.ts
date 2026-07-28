import { cn } from "@/lib/utils";

export type NavLinkVariant = "desktop" | "mobile";

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