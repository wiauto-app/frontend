import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const BrandLogo = ({
  variant = "primary",
  className,
}: {
  variant?: "primary" | "secondary" | "icon";
  className?: string;
}) => {

  const getLogoUrl = () => {
    switch (variant) {
      case "primary":
        return "/branding/logo-v2.avif";
      case "secondary":
        return "/branding/logo-v1.avif";
      case "icon":
        return "/branding/logo-icon.avif";
    }
  }

  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      className={cn("inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 relative w-44 h-full", className)}
    >
      <Image
        src={getLogoUrl()}
        alt="Wiauto"
        fill
        className="object-contain"
      />
    </Link>
  );
};
