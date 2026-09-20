import { collabsIconPack } from "@/app/(landing)/colaboraciones/components/collabsIconPack";
import { IconContainer } from "@/components/ui/iconContainer";
import type { StrapiColaboracionLanding } from "@/interfaces/landings-colaboracion.interface";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type CollaborationHeroCardSize = "sm" | "md" | "lg";

export interface CollaborationHeroCardProps {
  content: StrapiColaboracionLanding;
  className?: string;
  size?: CollaborationHeroCardSize;
}

const SIZE_STYLES: Record<
  CollaborationHeroCardSize,
  {
    rowGap: string;
    contentGap: string;
    icon: "sm" | "md" | "lg";
    title: string;
    description: string;
    logo: string;
    logoSizes: string;
    chevron: string;
  }
> = {
  sm: {
    rowGap: "gap-3",
    contentGap: "gap-3",
    icon: "sm",
    title: "text-sm font-semibold",
    description: "text-xs",
    logo: "relative h-8 min-w-16 md:h-10 md:min-w-24",
    logoSizes: "96px",
    chevron: "size-4",
  },
  md: {
    rowGap: "gap-4",
    contentGap: "gap-4",
    icon: "md",
    title: "text-base font-semibold lg:text-lg",
    description: "text-xs",
    logo: "relative h-10 min-w-20 md:h-16 md:min-w-32",
    logoSizes: "(max-width: 768px) 100vw, 112px",
    chevron: "size-5",
  },
  lg: {
    rowGap: "gap-5",
    contentGap: "gap-5",
    icon: "lg",
    title: "text-lg font-semibold lg:text-xl",
    description: "text-sm",
    logo: "relative h-12 min-w-24 md:h-20 md:min-w-40",
    logoSizes: "(max-width: 768px) 100vw, 160px",
    chevron: "size-6",
  },
};

export const CollaborationHeroCard = ({
  content,
  className,
  size = "md",
}: CollaborationHeroCardProps) => {
  const hero = content.hero;
  if (!hero) {
    return null;
  }

  const styles = SIZE_STYLES[size];
  const imageUrl = hero.card?.imagen?.url ?? hero.imagen?.url;
  const imageAlt =
    hero.card?.imagen?.alternativeText ||
    hero.imagen?.alternativeText ||
    hero.titulo ||
    content.nombre ||
    "";
  const action = hero.acciones?.[0];
  const href = action?.url ?? `/colaboraciones/${content.slug}`;
  const Icon = resolveStrapiIconName(content.iconName, collabsIconPack);

  return (
    <Link
      href={href}
      aria-label={hero.titulo || content.nombre}
      className={cn("group block", className)}
      {...(action?.externo
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          styles.rowGap,
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className={cn(
              "flex items-center justify-between",
              styles.rowGap,
            )}
          >
            <div className={cn("flex min-w-0 items-center", styles.contentGap)}>
              {Icon ? <IconContainer Icon={Icon} size={styles.icon} /> : null}
              <div className="min-w-0 space-y-1">
                <h2 className={styles.title}>{hero.titulo}</h2>
                {content.descripcion ? (
                  <p
                    className={cn(
                      "whitespace-pre-line text-muted-foreground",
                      styles.description,
                    )}
                  >
                    {content.descripcion}
                  </p>
                ) : null}
              </div>
            </div>
            <div className={styles.logo}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes={styles.logoSizes}
                  className="object-contain"
                />
              ) : null}
            </div>
          </div>
        </div>
        <ChevronRight
          className={cn(
            "shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground",
            styles.chevron,
          )}
          aria-hidden
        />
      </div>
    </Link>
  );
};
