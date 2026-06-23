"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BRAND_BLUE, isNavLinkActive, NAV_LINKS } from "../constants/navLinks.constants";
import { NavLinkItem } from "./NavLinkItem";
import { NavbarPublishButton } from "./NavbarPublishButton";
import { ServicesNavSection } from "./servicesDropdown";

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
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0061F2] focus-visible:ring-offset-2"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="size-5" aria-hidden />
        </SheetTrigger>

        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-slate-200 px-6 py-4 text-left">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <Link
              href="/"
              onClick={handleNavigate}
              aria-label="Ir al inicio"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              <span
                className="inline-flex size-8 items-center justify-center rounded-lg text-base font-bold text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                W
              </span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-slate-900">Wi</span>
                <span style={{ color: BRAND_BLUE }}>Auto</span>
              </span>
            </Link>
          </SheetHeader>

          <nav
            aria-label="Navegación móvil"
            className="flex flex-1 flex-col overflow-y-auto px-6 py-2"
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
            <NavbarPublishButton variant="mobile" onNavigate={handleNavigate} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
