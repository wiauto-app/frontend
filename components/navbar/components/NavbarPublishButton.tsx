import Link from "next/link";

import { cn } from "@/lib/utils";

import { BRAND_BLUE } from "../constants/navLinks.constants";

type NavbarPublishButtonProps = {
  variant?: "navbar" | "mobile";
  onNavigate?: () => void;
};

export function NavbarPublishButton({
  variant = "navbar",
  onNavigate,
}: NavbarPublishButtonProps) {
  const isMobileMenu = variant === "mobile";

  return (
    <Link
      href="/crear-vehiculo"
      onClick={onNavigate}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-bold text-white transition-opacity duration-200 hover:opacity-90",
        isMobileMenu ? "flex min-h-11 w-full" : "hidden shrink-0 sm:inline-flex",
      )}
      style={{ backgroundColor: BRAND_BLUE }}
    >
      Publicar
    </Link>
  );
}
