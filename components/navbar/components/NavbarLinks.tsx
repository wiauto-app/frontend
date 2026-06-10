"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ServicesDropdown } from "./servicesDropdown";

const BRAND_BLUE = "#0061F2";

const NAV_LINKS = [
  { href: "/", label: "Inicio", exact: true },
  { href: "/vehiculos", label: "Vehículos", exact: false },
  { href: "/noticias", label: "Noticias", exact: false },
  { href: "/prensa", label: "Prensa", exact: false },
  { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes", exact: false },
] as const;

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-8 lg:flex">
      {NAV_LINKS.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "text-sm font-bold text-slate-900 transition-colors hover:text-[#0061F2]",
                isActive && "text-[#0061F2]",
              )}
              style={isActive ? { color: BRAND_BLUE } : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
      <ServicesDropdown />
    </ul>
  );
}
