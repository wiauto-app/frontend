"use client";

import { usePathname } from "next/navigation";

import {
  isNavEntryActive,
  NAV_LINKS,
  NavLink,
} from "../constants/navLinks.constants";
import { NavLinkItem } from "./NavLinkItem";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { StrapiColaboracionLanding } from "@/interfaces/landings-colaboracion.interface";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

export function NavbarLinks({ colaboraciones }: { colaboraciones: StrapiColaboracionLanding[] }) {
  const pathname = usePathname();
  const navItems =  colaboraciones.map((col) => {
    const Icon =  resolveStrapiIconName(col.iconName);
    return {
      href: `/colaboraciones/${col.slug}`,
      label: col.nombre,
      description: col.descripcion,
      Icon: Icon ?? undefined,
    };
  })
  return (
    <NavigationMenu className="hidden max-w-none lg:flex" align="start">
      <NavigationMenuList className="gap-3">
        {NAV_LINKS.map((link) => {
          // Mergear items dinámicos con el grupo "Servicios"
          let itemsToRender = link.items;
          if (link.label === "Servicios" && navItems.length > 0) {
            itemsToRender = [...(link.items ?? []), ...navItems] as NavLink[];
          }

          return (
            <NavLinkItem
              key={link.href ?? link.label}
              href={link.href}
              label={link.label}
              items={itemsToRender}
              itemsGroups={link.itemsGroups}
              isActive={isNavEntryActive(pathname, link)}
              variant="desktop"
            />
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
