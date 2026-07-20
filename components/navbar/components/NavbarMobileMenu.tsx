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
import {
  BRAND_BLUE,
  isNavLinkActive,
  NAV_LINKS,
} from "../constants/navLinks.constants";
import { NavLinkItem } from "./NavLinkItem";
import { NavbarPublishButton } from "./NavbarPublishButton";
import { ServicesNavSection } from "./servicesDropdown";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brandLogo";

export const NavbarMobileMenu = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleNavigate = () => {
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon">
              <Menu className="size-5" aria-hidden />
            </Button>
          }
        ></SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-full flex-col  sm:max-w-sm"
          showCloseButton={false}
        >
          <SheetHeader className="flex flex-row items-center justify-between" >
            <div>
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <Link
                href="/"
                onClick={handleNavigate}
                aria-label="Ir al inicio"
                className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
              >
                <BrandLogo className="h-10" />
              </Link>
            </div>
            <Button variant="outline" size="icon" onClick={() => setOpen(false)}>
              <X className="size-5" aria-hidden />
            </Button>
          </SheetHeader>

          <nav
            aria-label="Navegación móvil"
            className="flex flex-1 flex-col overflow-y-auto "
          >
            {NAV_LINKS.map((link) => (
              <NavLinkItem
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isNavLinkActive(pathname, link.href)}
                variant="mobile"
                onNavigate={handleNavigate}
              />
            ))}

            <ServicesNavSection onNavigate={handleNavigate} />
          </nav>

          <div className="mt-auto border-t border-slate-200 px-6 py-4">
            <NavbarPublishButton />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
