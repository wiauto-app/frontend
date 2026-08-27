import {
  ChevronRightIcon,
  LockIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IconContainer } from "../ui/iconContainer";
import { IoCarSportOutline } from "react-icons/io5";
import { collabsService } from "./services/collabsService";
import { HeroFeatures } from "../home/heroFeatures";
import { StrapiRenderer } from "../ui/strapiRenderer";

export const NeedCarHelpBanner = async () => {
  const content = await collabsService.getReviewCollabContent();
  const card = content?.card;
  return (
    <Card className="border border-need-car-help-banner pb-0">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <IconContainer
              backgroundColor="#fff"
              iconColor="var(--need-car-help-banner)"
              Icon={IoCarSportOutline}
              size="xl"
            />
            <div className="">
              <CardTitle>{card?.titulo}</CardTitle>
              <CardDescription>{card?.descripcion}</CardDescription>
            </div>
          </div>
          <Image
            src={card?.imagen?.url ?? ""}
            alt="Need Car Help"
            width={180}
            height={140}
          />
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-end">
        <HeroFeatures
          features={card?.caracteristicas || []}
          className="text-primary"
        />
        <div className="flex flex-col gap-1 items-center">
          <Button className="bg-need-car-help-banner hover:bg-need-car-help-banner/80 text-white">
            {card?.acciones[0]?.label} <ChevronRightIcon />
          </Button>
          <span className="flex items-center gap-2 text-xs text-muted-foreground ">
            <LockIcon className="size-4" /> Pago 100% seguro
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted-foreground/10 border-t [.border-t]:py-2 ">
        <StrapiRenderer content={card?.footer} />
      </CardFooter>
    </Card>
  );
};
