import type { ElementType, ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { CustomSeparator } from "@/components/ui/customSeparator";

interface VehicleDetailCardProps {
  title: ReactNode | string;
  children: ReactNode;
  /** Etiqueta del título de la sección (por defecto `h2`). */
  as?: ElementType;
}

const titleClassName =
  "text-lg font-semibold text-gray-900 flex items-center gap-2";

export const VehicleDetailCard = ({
  title,
  children,
  as: TitleTag = "h2",
}: VehicleDetailCardProps) => {
  return (
    <Card size="sm">
      <CardContent className="space-y-5">
        <TitleTag className={titleClassName}>{title}</TitleTag>
        <CustomSeparator />
        {children}
      </CardContent>
    </Card>
  );
};
