"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface MobileNavbarItemData {
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  badgeLabel?: string | null;
  ariaLabel?: string;
}

interface MobileNavbarItemProps {
  item: MobileNavbarItemData;
}

const isItemActive = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export const MobileNavbarItem = ({ item }: MobileNavbarItemProps) => {
  const pathname = usePathname();
  const isActive = isItemActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-label={item.ariaLabel ?? item.label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2  transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "relative transition-transform",
          isActive && "scale-105",
        )}
      >
        {isActive ? item.activeIcon : item.icon}
        {item.badgeLabel ? (
          <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {item.badgeLabel}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "text-[10px] leading-tight",
          isActive ? "font-semibold" : "font-medium",
        )}
      >
        {item.label}
      </span>
      {isActive && (
        <span
          className="absolute bottom-0 h-0.5 w-4 rounded-full bg-primary"
          aria-hidden
        />
      )}
    </Link>
  );
};
