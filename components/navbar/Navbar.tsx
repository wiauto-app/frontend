"use client";

import { useEntitlements } from "@/hooks/useEntitlements";
import { BrandLogo } from "../ui/brandLogo";
import { NavbarActions } from "./components/NavbarActions";
import { NavbarLinks } from "./components/NavbarLinks";
import { NavbarMobileMenu } from "./components/NavbarMobileMenu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { isSubscribed } = useEntitlements();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <nav
        aria-label="Navegación principal"
        className={cn(
          " mx-auto flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
          pathname.includes("usuario") ? "container-full":"container-custom",
        )}
      >
        <BrandLogo variant={isSubscribed ? "pro" : "primary"} />
        <NavbarLinks />
        <NavbarActions />
        <NavbarMobileMenu />
      </nav>
    </header>
  );
};
