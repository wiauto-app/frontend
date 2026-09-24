import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "./card";
import { IconContainer } from "./iconContainer";
import { StrapiCard } from "@/interfaces/strapi-components.interface";
import { StrapiButton } from "./strapiButton";
import Image from "next/image";
import { cn } from "@/lib/utils";
export const HeroCard = ({
  card,
  className,
}: {
  card?: StrapiCard | null;
  className?: string;
}) => {
  const Icon = resolveStrapiIconName(
    card?.iconName ?? null,
    defaultStrapiIconPack,
  );
  return (
    <Card size="sm" className={cn("w-fit h-fit", className)}>
      <div className="px-4">
        {card?.imagen?.url ? (
          <Image
            src={card.imagen.url}
            alt={card.imagen.alternativeText ?? ""}
            width={300}
            height={300}
          />
        ) : null}
      </div>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {Icon ? <IconContainer size="xl" rounded Icon={Icon} /> : null}

        <CardTitle className="text-xl font-bold text-center max-w-64">
          {card?.titulo}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center max-w-64">
          {card?.descripcion}
        </CardDescription>
      </CardContent>
      {card?.boton && (
        <CardFooter className="flex justify-center">
          <StrapiButton button={card.boton} />
        </CardFooter>
      )}
    </Card>
  );
};
