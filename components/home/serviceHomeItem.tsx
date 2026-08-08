import Link from "next/link";
import { IconContainer } from "../ui/iconContainer";
import type { VehicleExtraServiceItem } from "./types/vehicle-extra-service.types";
import { Card, CardContent, CardFooter } from "../ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceHomeItemProps {
  item: VehicleExtraServiceItem;
}

const buildServiceGradient = (color: string): string =>
  `linear-gradient(
    to bottom,
    color-mix(in srgb, ${color} 18%, transparent) 0%,
    color-mix(in srgb, ${color} 6%, transparent) 45%,
    transparent 100%
  )`;

export const ServiceHomeItem = ({ item }: ServiceHomeItemProps) => {
  const accentColor = item.color;

  return (
    <Link
      href={item.href}
      aria-label={item.name}
      className="block h-full transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card
        size="sm"
        className={cn("h-full", accentColor && "border-0 shadow-sm")}
        style={
          accentColor
            ? {
                backgroundImage: buildServiceGradient(accentColor),
                backgroundColor: "var(--card)",
              }
            : undefined
        }
      >
        <CardContent className="flex-1 flex flex-col items-center gap-4">
          <IconContainer
            iconColor={accentColor}
            className="bg-white/10 shadow-md"
            Icon={item.icon}
          />
          <h3 className="text-center text-lg font-bold">{item.name}</h3>
          {accentColor ? (
            <div
              style={{ backgroundColor: accentColor }}
              className="h-1 w-8 rounded-full"
            />
          ) : null}
          <p className="text-center text-sm text-muted-foreground">
            {item.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="rounded-full"
            variant="outline"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            <ArrowRight className="size-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
