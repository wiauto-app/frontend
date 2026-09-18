"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isNavEntryActive, NAV_LINKS, NavLink } from "../constants/navLinks.constants";
import { NavLinkItem } from "./NavLinkItem";
import { NavbarPublishButton } from "./NavbarPublishButton";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brandLogo";
import { StrapiColaboracionLanding } from "@/interfaces/landings-colaboracion.interface";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

export const NavbarMobileMenu = ({ colaboraciones }: { colaboraciones: StrapiColaboracionLanding[] }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleNavigate = () => {
    setOpen(false);
  };
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
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="size-5" aria-hidden />
            </Button>
          }
        />

        <SheetContent
          side="right"
          className="flex w-full flex-col sm:max-w-sm gap-0"
          showCloseButton={false}
        >
          <SheetHeader className="flex flex-row items-center justify-between">
            <div>
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

              <BrandLogo className="h-10" />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú de navegación"
            >
              <X className="size-5" aria-hidden />
            </Button>
          </SheetHeader>

          <nav
            aria-label="Navegación móvil"
            className="flex flex-1 flex-col overflow-y-auto px-5 "
          >
            {NAV_LINKS.map((link) => {
              // Mergear items dinámicos con el grupo "Servicios"
              let itemsToRender = link.items;
              if (link.label === "Servicios" && colaboraciones.length > 0) {
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
                  variant="mobile"
                  onNavigate={handleNavigate}
                />
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-200 px-6 py-4">
            <NavbarPublishButton />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
