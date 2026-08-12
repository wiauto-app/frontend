import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LOGOS } from "@/lib/logos";

/** Variantes canónicas: familia + tono. */
export type BrandLogoCanonicalVariant =
  | "normal-black"
  | "normal-base"
  | "normal-white"
  | "pro-black"
  | "pro-base"
  | "pro-white"
  | "pro-sm-black"
  | "pro-sm-base"
  | "pro-sm-white";

/** Aliases legacy (compatibilidad con usos existentes). */
export type BrandLogoLegacyVariant =
  | "primary"
  | "secondary"
  | "icon"
  | "pro"
  | "pro-sm";

export type BrandLogoVariants =
  | BrandLogoCanonicalVariant
  | BrandLogoLegacyVariant;

interface BrandLogoProps {
  variant?: BrandLogoVariants;
  className?: string;
}

const LEGACY_VARIANT_ALIASES: Record<
  BrandLogoLegacyVariant,
  BrandLogoCanonicalVariant
> = {
  primary: "normal-black",
  secondary: "normal-base",
  icon: "normal-white",
  pro: "pro-black",
  "pro-sm": "pro-sm-black",
};

const LOGO_URL_BY_VARIANT: Record<BrandLogoCanonicalVariant, string> = {
  "normal-black": LOGOS.normal.black,
  "normal-base": LOGOS.normal.base,
  "normal-white": LOGOS.normal.white,
  "pro-black": LOGOS.pro.black,
  "pro-base": LOGOS.pro.base,
  "pro-white": LOGOS.pro.white,
  "pro-sm-black": LOGOS.pro_sm.black,
  "pro-sm-base": LOGOS.pro_sm.base,
  "pro-sm-white": LOGOS.pro_sm.white,
};

const resolveCanonicalVariant = (
  variant: BrandLogoVariants,
): BrandLogoCanonicalVariant => {
  if (variant in LEGACY_VARIANT_ALIASES) {
    return LEGACY_VARIANT_ALIASES[variant as BrandLogoLegacyVariant];
  }

  return variant as BrandLogoCanonicalVariant;
};

const isCompactVariant = (variant: BrandLogoCanonicalVariant): boolean =>
  variant.startsWith("pro-sm-") || variant === "normal-white";

export const BrandLogo = ({
  variant = "primary",
  className,
}: BrandLogoProps) => {
  const canonicalVariant = resolveCanonicalVariant(variant);
  const logoUrl = LOGO_URL_BY_VARIANT[canonicalVariant];
  const sizes = isCompactVariant(canonicalVariant) ? "80px" : "176px";
  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      className={cn(
        "relative inline-flex h-10 w-44 items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Image
        src={logoUrl}
        alt="Wiauto"
        fill
        sizes={sizes}
        className="object-contain"
        priority
        fetchPriority="high"
        quality={70}
      />
    </Link>
  );
};
