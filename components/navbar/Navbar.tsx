"use client";

import { useEntitlements } from "@/hooks/useEntitlements";
import { BrandLogo } from "../ui/brandLogo";
import { NavbarActions } from "./components/NavbarActions";
import { NavbarLinks } from "./components/NavbarLinks";
import { NavbarMobileMenu } from "./components/NavbarMobileMenu";

export const Navbar = () => {
  const { isSubscribed } = useEntitlements();
  console.log(isSubscribed);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white">
      <nav
        aria-label="Navegación principal"
        className="container-custom mx-auto flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <BrandLogo variant={isSubscribed ? "pro" : "primary"} />
        <NavbarLinks />
        <NavbarActions />
        <NavbarMobileMenu />
      </nav>
    </header>
  );
};
