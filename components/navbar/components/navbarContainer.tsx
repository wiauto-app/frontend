"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const NavbarContainer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <nav
    aria-label="Navegación principal"
    className={cn(
      " mx-auto flex pb-4 md:pb-0 md:h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
      pathname.includes("usuario") ? "container-full" : "container-custom",
    )}
  >
    {children}
  </nav>
  )
}
