import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuickLink } from "./types";
import { IconContainer } from "../ui/iconContainer";

interface VehicleDiscoveryQuickCardsProps {
  quickLinks: QuickLink[];
  className?: string;
}

export const VehicleDiscoveryQuickCards = ({
  quickLinks,
  className,
}: VehicleDiscoveryQuickCardsProps) => (
  <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
    {quickLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          "group flex items-center justify-between rounded-xl border bg-white p-3 transition-colors",
          !link.borderColor && "hover:border-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        )}
        style={link.borderColor ? { borderColor: link.borderColor } : undefined}
        aria-label={`Explorar ${link.label}`}
      >
        <div className="flex items-center gap-2">
          {link.imageUrl ? (
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
              <Image
                src={link.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : link.Icon ? (
            <IconContainer
              Icon={link.Icon}
              size="sm"
              backgroundColor={link.borderColor}
              iconColor={link.titleColor}
            />
          ) : null}
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm font-semibold",
                !link.titleColor && "text-foreground",
              )}
              style={link.titleColor ? { color: link.titleColor } : undefined}
            >
              {link.label}
            </p>
            {link.description ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {link.description}
              </p>
            ) : null}
          </div>
        </div>
        <ChevronRight
          className={cn(
            "size-5 shrink-0 transition-transform group-hover:translate-x-0.5",
            !link.titleColor && "text-primary",
          )}
          style={link.titleColor ? { color: link.titleColor } : undefined}
          aria-hidden
        />
      </Link>
    ))}
  </div>
);
