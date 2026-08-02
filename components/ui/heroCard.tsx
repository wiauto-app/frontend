import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
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
export const HeroCard = ({ card }: { card?: StrapiCard | null }) => {
  const Icon = resolveStrapiIconName(card?.iconName ?? null);
  return (
    <Card className="max-w-64 h-fit">
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {Icon ? <IconContainer size="xl" rounded Icon={Icon} /> : null}
        {card?.imagen?.url ? (
          <Image
            src={card.imagen.url}
            alt={card.imagen.alternativeText ?? ""}
            width={100}
            height={100}
          />
        ) : null}
        <CardTitle className="text-2xl font-bold text-center">
          {card?.titulo}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground text-center">
          {card?.descripcion}
        </CardDescription>
      </CardContent>
      {card?.boton && (
        <CardFooter>
          <StrapiButton button={card.boton} />
        </CardFooter>
      )}
    </Card>
  );
};
