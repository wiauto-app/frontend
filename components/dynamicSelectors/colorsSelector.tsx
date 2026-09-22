"use client";

import { colorsService } from "@/components/vehicles/services/colorsService";
import type { ColorCatalogItem } from "@/components/vehicles/types/catalog.types";
import { cn } from "@/lib/utils";
import { CatalogResourceSelector } from "./catalogResourceSelector";

interface ColorsSelectorProps {
  onValueChange: (value: string | undefined) => void;
  value?: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
}

interface ColorSwatchProps {
  hexCode: string;
  className?: string;
}

const ColorSwatch = ({ hexCode, className }: ColorSwatchProps) => (
  <span
    aria-hidden
    className={cn(
      "size-4 shrink-0 rounded-full border border-slate-300 shadow-xs",
      className,
    )}
    style={{ backgroundColor: hexCode || "#ffffff" }}
  />
);

const ColorOptionLabel = ({ color }: { color: ColorCatalogItem }) => (
  <span className="flex min-w-0 items-center gap-2">
    <ColorSwatch hexCode={color.hex_code} />
    <span className="truncate">{color.name}</span>
  </span>
);

export const ColorsSelector = ({
  onValueChange,
  value,
  ariaInvalid,
  disabled,
}: ColorsSelectorProps) => (
  <CatalogResourceSelector<ColorCatalogItem>
    queryKey={["colors"]}
    fetchItems={() => colorsService.findAll({ page: 1, limit: 100 })}
    value={value}
    onValueChange={onValueChange}
    placeholder="Color"
    ariaInvalid={ariaInvalid}
    disabled={disabled}
    getItemValue={(item) => item.id}
    getItemLabel={(item) => item.name}
    renderItem={(item) => <ColorOptionLabel color={item} />}
    renderSelectedValue={(item) => <ColorOptionLabel color={item} />}
  />
);
