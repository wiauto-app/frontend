import Link from "next/link";
import { Car } from "lucide-react";

export const NavbarBrand = () => {
  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      className="inline-flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-80"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Car className="size-4" aria-hidden="true" />
      </span>
      <span className="text-base tracking-tight">Wiautos</span>
    </Link>
  );
};
