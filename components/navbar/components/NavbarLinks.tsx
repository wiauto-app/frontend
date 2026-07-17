"use client";

import { usePathname } from "next/navigation";

import { isNavLinkActive, NAV_LINKS } from "../constants/navLinks.constants";
import { NavLinkItem } from "./NavLinkItem";

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-5 lg:flex">
      {NAV_LINKS.map((link) => (
        <li key={link.href}>
          <NavLinkItem
            href={link.href}
            label={link.label}
            isActive={isNavLinkActive(pathname, link.href)}
            variant="desktop"
          />
        </li>
      ))}
      {/* <ServicesDropdown /> */}
    </ul>
  );
}
