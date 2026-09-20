"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import {
  isNavEntryActive,
  NAV_LINKS,
} from "../constants/navLinks.constants";
import { NavLinkItem } from "./NavLinkItem";
import { NavbarCollaborationsMenu } from "./NavbarCollaborationsMenu";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { StrapiColaboracionLanding } from "@/interfaces/landings-colaboracion.interface";

const SERVICIOS_AFTER_LABEL = "Comprar";

export function NavbarLinks({
  colaboraciones,
}: {
  colaboraciones: StrapiColaboracionLanding[];
}) {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden max-w-none lg:flex" align="start">
      <NavigationMenuList className="gap-3">
        {NAV_LINKS.map((link) => (
          <Fragment key={link.href ?? link.label}>
            <NavLinkItem
              href={link.href}
              label={link.label}
              items={link.items}
              itemsGroups={link.itemsGroups}
              isActive={isNavEntryActive(pathname, link)}
              variant="desktop"
            />
            {link.label === SERVICIOS_AFTER_LABEL ? (
              <NavbarCollaborationsMenu
                colaboraciones={colaboraciones}
                variant="desktop"
              />
            ) : null}
          </Fragment>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
