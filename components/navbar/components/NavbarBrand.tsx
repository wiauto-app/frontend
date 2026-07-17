import Link from "next/link";
import Image from "next/image";

export const NavbarBrand = () => {
  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 relative w-44 h-full"
    >
      <Image src="/branding/logo-v2.avif" alt="Wiauto" fill className="object-contain" />
    </Link>
  );
};
