"use client";

import { usePathname } from "next/navigation";

import {
  isNavEntryActive,
  NAV_LINKS,
} from "../constants/navLinks.constants";
import { NavLinkItem } from "./NavLinkItem";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden max-w-none lg:flex" align="start">
      <NavigationMenuList className="gap-3">
        {NAV_LINKS.map((link) => (
          <NavLinkItem
            key={link.href ?? link.label}
            href={link.href}
            label={link.label}
            items={link.items}
            itemsGroups={link.itemsGroups}
            isActive={isNavEntryActive(pathname, link)}
            variant="desktop"
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
