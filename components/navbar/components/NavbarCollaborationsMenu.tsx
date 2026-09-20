"use client";

import { usePathname } from "next/navigation";

import { CollaborationHeroCard } from "@/components/collabs/CollaborationHeroCard";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { StrapiColaboracionLanding } from "@/interfaces/landings-colaboracion.interface";
import { cn } from "@/lib/utils";

import { BRAND_BLUE, isNavLinkActive } from "../constants/navLinks.constants";
import { getNavLinkItemClassName } from "./getNavLinkItemClassName";

interface NavbarCollaborationsMenuProps {
  colaboraciones: StrapiColaboracionLanding[];
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

export const NavbarCollaborationsMenu = ({
  colaboraciones,
  variant,
  onNavigate,
}: NavbarCollaborationsMenuProps) => {
  const pathname = usePathname();
  const isActive = isNavLinkActive(pathname, "/colaboraciones");

  if (colaboraciones.length === 0) {
    return null;
  }

  if (variant === "mobile") {
    return (
      <div className="border-b border-slate-100">
        <p className="mb-3 text-base font-semibold text-slate-900">Servicios</p>
        <ul className="mb-2 flex flex-col gap-1 pb-2">
          {colaboraciones.map((collaboration) => (
            <li key={collaboration.id}>
              <CollaborationHeroCard
                content={collaboration}
                size="sm"
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          getNavLinkItemClassName("desktop", isActive),
          "h-auto rounded-none bg-transparent px-0 py-0 text-[13px] shadow-none hover:bg-transparent focus:bg-transparent focus-visible:ring-0 data-open:bg-transparent data-popup-open:bg-transparent",
        )}
        style={isActive ? { color: BRAND_BLUE } : undefined}
      >
        Servicios
      </NavigationMenuTrigger>
      <NavigationMenuContent className="p-2">
        <ul className="flex min-w-md flex-col gap-3">
          {colaboraciones.map((collaboration) => (
            <li key={collaboration.id}>
              <CollaborationHeroCard
                content={collaboration}
                size="sm"
              />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
